# AutoDM - Instagram Comment-to-DM Automation Platform 🚀

A production-ready SaaS application for Instagram Business & Creator accounts to automatically trigger private Instagram DMs and public comment replies when followers comment specific keywords (e.g. `LOCATION`, `WHERE`, `PRICE`) on Reels or Posts.

Built with **React**, **Vite**, **TypeScript**, **Tailwind CSS**, **Supabase**, and **Supabase Edge Functions**, using official **Meta Instagram Graph API** and **Meta Webhooks**.

---

## 📸 Key Features

- **Official Meta Instagram Graph API Integration**: Authenticate Instagram Professional / Business accounts via Meta OAuth.
- **Post & Reel Selection**: Display recent Instagram media cards with thumbnail preview, caption, and one-click automation creation.
- **Flexible Automation Engine**:
  - Multi-keyword trigger matching (e.g., `LOCATION`, `LOC`, `WHERE`, `ADDRESS`).
  - Match types: `Exact Keyword Match` or `Contains Keyword`.
  - Configurable public comment reply (e.g. *"Sent it to your DMs 📩✨"*).
  - Configurable private DM message with dynamic location name & Google Maps link.
  - Active / Paused state toggle.
- **Strict Duplicate Protection**: Unique database constraint on `instagram_comment_id` prevents duplicate DM triggers if Meta resends webhooks.
- **Real-Time Activity Feed & Drawer**: Filter event history (All, DM Sent, Failed, Date ranges) and inspect full comment-to-DM payload details.
- **Interactive Webhook Sandbox & Test Mode**: Simulate incoming Meta webhook payloads end-to-end with live step-by-step trace logs without waiting for Meta App Review approval.
- **Step-by-step Meta Developer Setup Guide**: Built directly into the dashboard with checklist steps, required scopes, webhook verification instructions, and API references.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons
- **Backend & Database**: Supabase PostgreSQL (with RLS Policies & Indexes)
- **Edge Functions**: Deno TypeScript (`instagram-webhook`)
- **API**: Meta Instagram Graph API (`v19.0`), Instagram Messaging API (Private Replies & Messages)
- **Deployment**: Vercel (Frontend), Supabase CLI (Edge Functions)

---

## 🗄 Database Schema

The platform utilizes 5 main PostgreSQL tables managed via Supabase migrations:

1. `instagram_accounts`: Stores connected Instagram business user metadata.
2. `instagram_posts`: Caches fetched Instagram media / Reels.
3. `automations`: Defines trigger keywords, public reply, DM content, Google Maps URL, and active status.
4. `automation_keywords`: Stores secondary keywords per automation.
5. `automation_events`: Logs all execution attempts with `instagram_comment_id TEXT UNIQUE` constraint for strict duplicate prevention.

Migration script location: [`supabase/migrations/20260923_init_schema.sql`](./supabase/migrations/20260923_init_schema.sql).

---

## ⚡ Supabase Edge Function (`instagram-webhook`)

Location: [`supabase/functions/instagram-webhook/index.ts`](./supabase/functions/instagram-webhook/index.ts).

### 1. `GET` Verification
Handles Meta Webhook handshake by validating `hub.mode`, `hub.verify_token`, and echoing `hub.challenge`.

### 2. `POST` Webhook Payload Processing
1. Extracts `comment_id`, `media_id`, `commenter_id`, `@username`, and `comment_text`.
2. Checks `instagram_comment_id` in `automation_events` to reject duplicate webhook deliveries.
3. Matches post and active keyword rules.
4. Posts public reply via `POST https://graph.facebook.com/v19.0/{comment_id}/replies`.
5. Sends private Instagram DM via `POST https://graph.facebook.com/v19.0/me/messages` (Private Reply format).
6. Updates automation counter stats and records detailed event status in Supabase.

---

## 📋 Step-by-Step Meta Developer Setup

1. **Create Meta Developer App**:
   - Go to [Meta for Developers](https://developers.facebook.com/) and create a Business App.
2. **Add Instagram Graph API & Messenger Products**:
   - Enable **Instagram Graph API** and **Messenger** products.
3. **Configure Webhook Endpoint**:
   - Webhook Callback URL: `https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/functions/v1/instagram-webhook`
   - Verify Token: Matches your `META_VERIFY_TOKEN` secret.
   - Subscribed Fields: `comments`, `mentions`.
4. **Set Supabase Secrets**:
   ```bash
   supabase secrets set META_VERIFY_TOKEN="your_verify_token"
   supabase secrets set META_ACCESS_TOKEN="your_long_lived_token"
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
   ```
5. **Required Meta Permissions (App Review)**:
   - `instagram_basic`
   - `instagram_manage_comments`
   - `instagram_manage_messages`
   - `pages_messaging`

---

## 🚀 Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env.local

# 3. Start development server
npm run dev
```

---

## 🌐 Deploying to Vercel

1. Push code to GitHub repository.
2. Import project in Vercel.
3. Add environment variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Deploy!

---

## 🛡 Security & Privacy

- Access tokens are strictly hidden from client queries and managed via Supabase environment secrets.
- All PostgreSQL tables enforce Row Level Security (RLS) ensuring users only access their own Instagram accounts and automations.
