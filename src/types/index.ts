export type AccountType = 'BUSINESS' | 'CREATOR' | 'PERSONAL';

export interface InstagramAccount {
  id: string;
  user_id?: string;
  instagram_user_id: string;
  username: string;
  profile_picture_url?: string;
  account_type: AccountType;
  followers_count: number;
  access_token_reference?: string;
  token_expires_at?: string;
  is_connected: boolean;
  created_at: string;
  updated_at?: string;
}

export type MediaType = 'REEL' | 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';

export interface InstagramPost {
  id: string;
  account_id: string;
  instagram_media_id: string;
  media_type: MediaType;
  caption: string;
  thumbnail_url: string;
  permalink: string;
  published_at: string;
  comments_count?: number;
  like_count?: number;
  created_at?: string;
}

export type MatchType = 'exact' | 'contains';

export interface AutomationKeyword {
  id?: string;
  automation_id?: string;
  keyword: string;
  created_at?: string;
}

export interface Automation {
  id: string;
  account_id: string;
  post_id: string;
  post?: InstagramPost;
  keyword: string;
  keywords?: string[];
  match_type: MatchType;
  public_reply: string;
  dm_message: string;
  location_name?: string;
  location_url?: string;
  active: boolean;
  trigger_count: number;
  dm_sent_count: number;
  created_at: string;
  updated_at?: string;
}

export type EventStatus = 'sent' | 'failed' | 'duplicate' | 'ignored';

export interface AutomationEvent {
  id: string;
  automation_id?: string;
  automation_keyword?: string;
  post_title?: string;
  instagram_comment_id: string;
  instagram_media_id: string;
  commenter_instagram_id: string;
  commenter_username: string;
  comment_text: string;
  public_reply_sent: boolean;
  dm_sent: boolean;
  status: EventStatus;
  error_message?: string | null;
  created_at: string;
}

export interface LiveTestConnectionResult {
  meta_api_ok: boolean;
  instagram_connected: boolean;
  webhook_verified: boolean;
  permissions_granted: string[];
  username?: string;
  error_message?: string;
  tested_at: string;
}

export type ActiveTab = 'dashboard' | 'automations' | 'posts' | 'activity' | 'setup' | 'privacy' | 'data-deletion';
