import React from 'react';
import type { InstagramAccount, Automation, AutomationEvent, ActiveTab } from '../../types';
import { 
  Zap, 
  MessageSquare, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight, 
  Plus, 
  Film, 
  Clock,
  Sparkles,
  Camera
} from 'lucide-react';

interface DashboardOverviewProps {
  account: InstagramAccount | null;
  automations: Automation[];
  events: AutomationEvent[];
  setActiveTab: (tab: ActiveTab) => void;
  onNewAutomation: () => void;
  onConnectInstagram: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  account,
  automations,
  events,
  setActiveTab,
  onNewAutomation,
  onConnectInstagram,
}) => {
  const activeAutomationsCount = automations.filter((a) => a.active).length;
  const commentsTriggered = events.length;
  const dmsSent = events.filter((e) => e.dm_sent || e.status === 'sent').length;
  const failedCount = events.filter((e) => e.status === 'failed').length;

  const recentEvents = events.slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Top Account & Quick Action Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {account && account.is_connected ? (
          <div className="flex items-center gap-4">
            {account.profile_picture_url ? (
              <img
                src={account.profile_picture_url}
                alt={account.username}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-white/10 shadow-lg"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-rose-500 text-white font-bold text-2xl flex items-center justify-center ring-4 ring-white/10">
                {account.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold text-white">@{account.username}</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Instagram Connected
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Instagram Account ({account.account_type}) • {account.followers_count.toLocaleString()} Followers
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-amber-400">
              <Camera className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white mb-1">No Instagram Account Connected</h2>
              <p className="text-xs text-slate-300">
                Connect your Instagram Professional or Business account via Meta OAuth to activate live automation.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {account && account.is_connected ? (
            <button
              onClick={onNewAutomation}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 hover:opacity-95 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Create Automation
            </button>
          ) : (
            <button
              onClick={onConnectInstagram}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 hover:opacity-95 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Camera className="h-4 w-4" />
              Connect Instagram
            </button>
          )}

          <button
            onClick={() => setActiveTab('posts')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl border border-white/10 transition-all cursor-pointer"
          >
            <Film className="h-4 w-4 text-slate-300" />
            Browse Reels
          </button>
        </div>
      </div>

      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Active Automations */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Automations
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeAutomationsCount}
            </span>
            <span className="text-xs font-medium text-slate-500">
              of {automations.length} total
            </span>
          </div>
        </div>

        {/* Comments Triggered */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Comments Triggered
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {commentsTriggered.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              Live Webhooks
            </span>
          </div>
        </div>

        {/* DMs Sent */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              DMs Sent
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Send className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {dmsSent.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 font-semibold">
              {commentsTriggered > 0 ? `${Math.round((dmsSent / commentsTriggered) * 100)}% delivered` : '100%'}
            </span>
          </div>
        </div>

        {/* Failed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Failed
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {failedCount}
            </span>
            <span className="text-xs font-medium text-slate-400">
              Meta API errors
            </span>
          </div>
        </div>

      </div>

      {/* Main Grid: Active Automations + Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left (2 cols): Active Automations Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Active Automations</h3>
              <p className="text-xs text-slate-500">Live rules processing incoming comment webhooks</p>
            </div>
            <button
              onClick={() => setActiveTab('automations')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {automations.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <Sparkles className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No Automations Created Yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Set up your first keyword automation rule to automatically send location links when users comment.
              </p>
              <button
                onClick={onNewAutomation}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                + Create Automation
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {automations.map((auto) => (
                <div
                  key={auto.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                      <Sparkles className="h-5 w-5 text-rose-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {auto.post?.caption ? auto.post.caption.slice(0, 35) + '...' : 'Instagram Post/Reel'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase">
                          {auto.keyword}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        DM: "{auto.dm_message.slice(0, 50)}..."
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900">
                      {auto.dm_sent_count.toLocaleString()} DMs
                    </span>
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          auto.active ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      />
                      <span className="text-[11px] font-semibold text-slate-600 uppercase">
                        {auto.active ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right (1 col): Recent Activity Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
              <p className="text-xs text-slate-500">Live webhook processing stream</p>
            </div>
            <button
              onClick={() => setActiveTab('activity')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              View Log
            </button>
          </div>

          {recentEvents.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No live webhook events received yet. When users comment matching keywords on your Reel, events will appear here in real-time.
            </div>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">@{evt.commenter_username}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px]">
                        {evt.comment_text}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(evt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs mt-2">
                    <span className="text-slate-500 text-[11px] truncate max-w-[150px]">
                      Comment Event
                    </span>
                    
                    {evt.status === 'sent' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        DM Sent ✓
                      </span>
                    )}

                    {evt.status === 'failed' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                        <XCircle className="h-3 w-3 text-rose-600" />
                        DM Failed ✕
                      </span>
                    )}

                    {evt.status === 'duplicate' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                        Duplicate Suppressed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
