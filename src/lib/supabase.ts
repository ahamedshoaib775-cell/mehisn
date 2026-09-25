import { createClient } from '@supabase/supabase-js';
import type { InstagramAccount, InstagramPost, Automation, AutomationEvent } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('your-supabase-project')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Real Supabase Data Accessors ---

export async function fetchLiveAccount(): Promise<InstagramAccount | null> {
  if (!isSupabaseConfigured) return null;
  
  const { data, error } = await supabase
    .from('instagram_accounts')
    .select('*')
    .eq('is_connected', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as InstagramAccount;
}

export async function fetchLivePosts(accountId?: string): Promise<InstagramPost[]> {
  if (!isSupabaseConfigured) return [];
  
  let query = supabase
    .from('instagram_posts')
    .select('*')
    .order('published_at', { ascending: false });

  if (accountId) {
    query = query.eq('account_id', accountId);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data as InstagramPost[];
}

export async function fetchLiveAutomations(accountId?: string): Promise<Automation[]> {
  if (!isSupabaseConfigured) return [];
  
  let query = supabase
    .from('automations')
    .select('*, post:instagram_posts(*), automation_keywords(keyword)')
    .order('created_at', { ascending: false });

  if (accountId) {
    query = query.eq('account_id', accountId);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((item: any) => {
    const keywordsList: string[] = (item.automation_keywords || []).map((k: { keyword: string }) => k.keyword);
    if (!keywordsList.includes(item.keyword)) {
      keywordsList.unshift(item.keyword);
    }
    return {
      id: item.id,
      account_id: item.account_id,
      post_id: item.post_id,
      post: item.post,
      keyword: item.keyword,
      keywords: keywordsList,
      match_type: item.match_type,
      public_reply: item.public_reply,
      dm_message: item.dm_message,
      location_name: item.location_name,
      location_url: item.location_url,
      active: item.active,
      trigger_count: item.trigger_count || 0,
      dm_sent_count: item.dm_sent_count || 0,
      created_at: item.created_at,
      updated_at: item.updated_at,
    };
  });
}

export async function saveLiveAutomation(auto: Partial<Automation>): Promise<Automation | null> {
  if (!isSupabaseConfigured) return null;

  const payload = {
    account_id: auto.account_id,
    post_id: auto.post_id,
    keyword: auto.keyword || 'LOCATION',
    match_type: auto.match_type || 'exact',
    public_reply: auto.public_reply || 'Sent it to your DMs 📩✨',
    dm_message: auto.dm_message || 'Hey! Here is the location you requested 📍',
    location_name: auto.location_name || '',
    location_url: auto.location_url || '',
    active: auto.active !== undefined ? auto.active : true,
  };

  let savedId = auto.id;

  if (auto.id) {
    // Update
    const { error } = await supabase
      .from('automations')
      .update(payload)
      .eq('id', auto.id);
    if (error) console.error('Failed to update automation:', error);
  } else {
    // Insert
    const { data, error } = await supabase
      .from('automations')
      .insert(payload)
      .select()
      .single();
    if (error) {
      console.error('Failed to insert automation:', error);
      return null;
    }
    savedId = data.id;
  }

  // Handle keywords
  if (savedId && auto.keywords) {
    // Delete existing keywords for update
    await supabase.from('automation_keywords').delete().eq('automation_id', savedId);
    
    // Insert keywords
    const keywordsToInsert = auto.keywords.map((kw) => ({
      automation_id: savedId,
      keyword: kw.trim(),
    }));
    if (keywordsToInsert.length > 0) {
      await supabase.from('automation_keywords').insert(keywordsToInsert);
    }
  }

  // Refetch saved automation
  const { data: updated } = await supabase
    .from('automations')
    .select('*, post:instagram_posts(*), automation_keywords(keyword)')
    .eq('id', savedId)
    .single();

  if (!updated) return null;

  const keywordsList: string[] = (updated.automation_keywords || []).map((k: { keyword: string }) => k.keyword);

  return {
    id: updated.id,
    account_id: updated.account_id,
    post_id: updated.post_id,
    post: updated.post,
    keyword: updated.keyword,
    keywords: keywordsList,
    match_type: updated.match_type,
    public_reply: updated.public_reply,
    dm_message: updated.dm_message,
    location_name: updated.location_name,
    location_url: updated.location_url,
    active: updated.active,
    trigger_count: updated.trigger_count || 0,
    dm_sent_count: updated.dm_sent_count || 0,
    created_at: updated.created_at,
    updated_at: updated.updated_at,
  };
}

export async function toggleLiveAutomationStatus(id: string, active: boolean): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase
    .from('automations')
    .update({ active })
    .eq('id', id);
  return !error;
}

export async function deleteLiveAutomation(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase
    .from('automations')
    .delete()
    .eq('id', id);
  return !error;
}

export async function fetchLiveEvents(): Promise<AutomationEvent[]> {
  if (!isSupabaseConfigured) return [];
  
  const { data, error } = await supabase
    .from('automation_events')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as AutomationEvent[];
}
