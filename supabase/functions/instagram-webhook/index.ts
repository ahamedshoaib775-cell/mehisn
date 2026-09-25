// Supabase Edge Function: instagram-webhook
// Official Meta Instagram Webhook & Live Messaging Handler
// Graph API Version: v22.0

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  const url = new URL(req.url);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // 1. GET Request: Official Meta Webhook Verification
  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    const expectedToken = Deno.env.get("META_VERIFY_TOKEN") || "my_secure_verify_token_123";

    console.log(`[WEBHOOK_VERIFY] Mode: ${mode}, Token matched: ${token === expectedToken}`);

    if (mode === "subscribe" && token === expectedToken) {
      console.log("[WEBHOOK_VERIFIED] Successfully verified webhook with Meta.");
      return new Response(challenge, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    return new Response("Verification token mismatch", { status: 403 });
  }

  // 2. POST Request: Live Instagram Comment Webhook Event Notification
  if (req.method === "POST") {
    try {
      const body = await req.json();
      console.log("[WEBHOOK_RECEIVED] Incoming Meta webhook payload:", JSON.stringify(body));

      const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
      const metaAccessToken = Deno.env.get("META_ACCESS_TOKEN") || "";

      if (!supabaseUrl || !supabaseServiceKey) {
        console.error("[WEBHOOK_ERROR] Missing Supabase environment variables.");
        return new Response(JSON.stringify({ error: "Server misconfiguration" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Verify payload structure (Instagram Graph API webhook format)
      if (body.object === "instagram" || body.entry) {
        const entries = body.entry || [];

        for (const entry of entries) {
          const changes = entry.changes || [];
          for (const change of changes) {
            const value = change.value || {};
            
            // Extract comment details
            const commentId = value.id || value.comment_id;
            const mediaId = value.media?.id || value.media_id;
            const commenterId = value.from?.id || value.user_id;
            const commenterUsername = value.from?.username || value.username || "instagram_user";
            const commentText = value.text || "";

            if (!commentId || !mediaId || !commentText) {
              console.log("[COMMENT_SKIP] Payload change does not contain complete comment fields.");
              continue;
            }

            console.log(`[COMMENT_IDENTIFIED] ID: ${commentId}, Media: ${mediaId}, User: @${commenterUsername}, Text: "${commentText}"`);

            // DUPLICATE PROTECTION STEP: Check if comment_id already exists in automation_events table
            const { data: existingEvent } = await supabase
              .from("automation_events")
              .select("id")
              .eq("instagram_comment_id", commentId)
              .maybeSingle();

            if (existingEvent) {
              console.log(`[DUPLICATE_PROTECTION] Comment ID ${commentId} already exists in DB. Skipping duplicate processing.`);
              continue;
            }

            // Find matching post in instagram_posts table
            const { data: postData } = await supabase
              .from("instagram_posts")
              .select("id, account_id")
              .eq("instagram_media_id", mediaId)
              .maybeSingle();

            // Fetch automations for post or general active automations
            let automationsQuery = supabase
              .from("automations")
              .select("*, automation_keywords(keyword)")
              .eq("active", true);

            if (postData) {
              automationsQuery = automationsQuery.eq("post_id", postData.id);
            }

            const { data: automations, error: autoErr } = await automationsQuery;

            if (autoErr || !automations || automations.length === 0) {
              console.log(`[AUTOMATION_NONE] No active automations found for media ID ${mediaId}`);
              
              // Log ignored event
              await supabase.from("automation_events").insert({
                instagram_comment_id: commentId,
                instagram_media_id: mediaId,
                commenter_instagram_id: commenterId,
                commenter_username: commenterUsername,
                comment_text: commentText,
                public_reply_sent: false,
                dm_sent: false,
                status: "ignored",
                error_message: "No active automation configured for this post",
              });
              continue;
            }

            // Keyword Matching
            const normalizedText = commentText.trim().toLowerCase();
            let matchedAutomation = null;

            for (const auto of automations) {
              const keywordsList: string[] = [
                auto.keyword,
                ...(auto.automation_keywords || []).map((k: { keyword: string }) => k.keyword),
              ].filter(Boolean);

              const isMatch = keywordsList.some((kw) => {
                const normalizedKw = kw.trim().toLowerCase();
                if (auto.match_type === "contains") {
                  return normalizedText.includes(normalizedKw);
                }
                return normalizedText === normalizedKw;
              });

              if (isMatch) {
                matchedAutomation = auto;
                break;
              }
            }

            if (!matchedAutomation) {
              console.log(`[AUTOMATION_NO_MATCH] Comment "${commentText}" did not match any active keywords.`);
              await supabase.from("automation_events").insert({
                instagram_comment_id: commentId,
                instagram_media_id: mediaId,
                commenter_instagram_id: commenterId,
                commenter_username: commenterUsername,
                comment_text: commentText,
                public_reply_sent: false,
                dm_sent: false,
                status: "ignored",
                error_message: "Comment text did not match automation keywords",
              });
              continue;
            }

            console.log(`[AUTOMATION_MATCHED] Automation ID: ${matchedAutomation.id}, Keyword matched: "${matchedAutomation.keyword}"`);

            let publicReplySent = false;
            let dmSent = false;
            let errorMessage: string | null = null;

            // 1. REAL PUBLIC REPLY via Meta Graph API
            if (matchedAutomation.public_reply && metaAccessToken) {
              try {
                const replyUrl = `https://graph.facebook.com/v22.0/${commentId}/replies`;
                const replyResp = await fetch(replyUrl, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    message: matchedAutomation.public_reply,
                    access_token: metaAccessToken,
                  }),
                });
                const replyData = await replyResp.json();
                if (replyResp.ok && !replyData.error) {
                  publicReplySent = true;
                  console.log("[PUBLIC_REPLY_SENT] Successfully posted public comment reply via Meta API.");
                } else {
                  console.error("[PUBLIC_REPLY_FAILED]", replyData);
                  errorMessage = `Public Reply Error: ${replyData.error?.message || "Meta API error"}`;
                }
              } catch (err: any) {
                console.error("[PUBLIC_REPLY_EXCEPTION]", err);
                errorMessage = `Public Reply Exception: ${err.message}`;
              }
            } else if (!metaAccessToken) {
              errorMessage = "META_ACCESS_TOKEN secret is not set in Supabase Edge Function.";
            }

            // 2. REAL PRIVATE INSTAGRAM DM via Meta Instagram Messaging API (Private Reply)
            if (metaAccessToken) {
              try {
                const dmUrl = `https://graph.facebook.com/v22.0/me/messages`;
                
                // Formulate Meta Instagram Private Reply Payload with structured Button Template
                const messagePayload = {
                  recipient: { comment_id: commentId },
                  message: {
                    attachment: {
                      type: "template",
                      payload: {
                        template_type: "generic",
                        elements: [
                          {
                            title: matchedAutomation.location_name
                              ? `📍 ${matchedAutomation.location_name}`
                              : "Location Details",
                            subtitle: matchedAutomation.dm_message,
                            buttons: matchedAutomation.location_url
                              ? [
                                  {
                                    type: "web_url",
                                    url: matchedAutomation.location_url,
                                    title: "📍 Open Location",
                                  },
                                ]
                              : [],
                          },
                        ],
                      },
                    },
                  },
                  access_token: metaAccessToken,
                };

                let dmResp = await fetch(dmUrl, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(messagePayload),
                });
                let dmData = await dmResp.json();

                // Fallback to text message if generic template is rejected
                if (!dmResp.ok || dmData.error) {
                  console.log("[DM_TEMPLATE_FALLBACK] Retrying with plain text payload.");
                  let textPayloadMsg = matchedAutomation.dm_message;
                  if (matchedAutomation.location_name) {
                    textPayloadMsg += `\n\n📍 ${matchedAutomation.location_name}`;
                  }
                  if (matchedAutomation.location_url) {
                    textPayloadMsg += `\n🔗 ${matchedAutomation.location_url}`;
                  }

                  const fallbackPayload = {
                    recipient: { comment_id: commentId },
                    message: { text: textPayloadMsg },
                    access_token: metaAccessToken,
                  };

                  dmResp = await fetch(dmUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(fallbackPayload),
                  });
                  dmData = await dmResp.json();
                }

                if (dmResp.ok && !dmData.error) {
                  dmSent = true;
                  console.log("[DM_SENT] Successfully sent real private Instagram DM via Meta API.");
                } else {
                  console.error("[DM_FAILED]", dmData);
                  const metaMsg = dmData.error?.message || "Meta API error";
                  errorMessage = errorMessage
                    ? `${errorMessage} | DM Error: ${metaMsg}`
                    : `DM Error: ${metaMsg}`;
                }
              } catch (err: any) {
                console.error("[DM_EXCEPTION]", err);
                errorMessage = errorMessage
                  ? `${errorMessage} | DM Exception: ${err.message}`
                  : `DM Exception: ${err.message}`;
              }
            }

            const finalStatus = dmSent || publicReplySent ? "sent" : "failed";

            // SAVE REAL EVENT RESULT IN SUPABASE DATABASE
            const { error: insertErr } = await supabase.from("automation_events").insert({
              automation_id: matchedAutomation.id,
              instagram_comment_id: commentId,
              instagram_media_id: mediaId,
              commenter_instagram_id: commenterId,
              commenter_username: commenterUsername,
              comment_text: commentText,
              public_reply_sent: publicReplySent,
              dm_sent: dmSent,
              status: finalStatus,
              error_message: errorMessage,
            });

            if (insertErr) {
              console.error("[EVENT_SAVE_ERROR]", insertErr);
            } else {
              console.log(`[EVENT_SAVED] Saved event for comment ${commentId}, Status: ${finalStatus}`);
            }

            // Update automation stats counter if sent
            if (finalStatus === "sent") {
              await supabase
                .from("automations")
                .update({
                  trigger_count: (matchedAutomation.trigger_count || 0) + 1,
                  dm_sent_count: (matchedAutomation.dm_sent_count || 0) + (dmSent ? 1 : 0),
                })
                .eq("id", matchedAutomation.id);
            }
          }
        }
      }

      // Return 200 OK rapidly to Meta
      return new Response(JSON.stringify({ success: true, message: "Live webhook processed" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error: any) {
      console.error("[WEBHOOK_ERROR]", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  return new Response("Method not allowed", { status: 405 });
});
