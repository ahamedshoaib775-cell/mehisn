import React, { useState } from 'react';
import type { AutomationEvent } from '../../types';
import { 
  Activity, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Send, 
  AlertTriangle,
  X
} from 'lucide-react';

interface ActivityLogProps {
  events: AutomationEvent[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ events }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'failed' | 'today' | '7days'>('all');
  const [selectedEvent, setSelectedEvent] = useState<AutomationEvent | null>(null);

  const now = Date.now();

  const filteredEvents = events.filter((evt) => {
    // Search match
    const matchesSearch =
      evt.commenter_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.comment_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt.post_title && evt.post_title.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'sent') return evt.status === 'sent';
    if (statusFilter === 'failed') return evt.status === 'failed';
    
    const evtTime = new Date(evt.created_at).getTime();
    if (statusFilter === 'today') {
      return now - evtTime < 24 * 60 * 60 * 1000;
    }
    if (statusFilter === '7days') {
      return now - evtTime < 7 * 24 * 60 * 60 * 1000;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Activity Log</h2>
          <p className="text-xs text-slate-500">
            Real-time execution log of incoming comment webhooks & DM responses
          </p>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user, comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('sent')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                statusFilter === 'sent' ? 'bg-emerald-600 text-white shadow-sm font-semibold' : 'text-slate-600'
              }`}
            >
              Successful
            </button>
            <button
              onClick={() => setStatusFilter('failed')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                statusFilter === 'failed' ? 'bg-rose-600 text-white shadow-sm font-semibold' : 'text-slate-600'
              }`}
            >
              Failed
            </button>
            <button
              onClick={() => setStatusFilter('today')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                statusFilter === 'today' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setStatusFilter('7days')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                statusFilter === '7days' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600'
              }`}
            >
              Last 7 days
            </button>
          </div>

        </div>
      </div>

      {/* Events Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Post & Comment</th>
                <th className="py-3 px-4">Keyword</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No activity logs recorded for this filter.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      @{evt.commenter_username}
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate">
                        {evt.post_title || 'Instagram Post'}
                      </div>
                      <div className="text-slate-500 italic truncate">
                        "{evt.comment_text}"
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase">
                        {evt.automation_keyword || evt.comment_text}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {evt.status === 'sent' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          DM Sent ✓
                        </span>
                      )}

                      {evt.status === 'failed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                          <XCircle className="h-3.5 w-3.5 text-rose-600" />
                          Failed
                        </span>
                      )}

                      {evt.status === 'duplicate' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                          Duplicate Suppressed
                        </span>
                      )}

                      {evt.status === 'ignored' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          No Rule Match
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(evt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                        View Payload
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Details Drawer Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden space-y-4">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Event Execution Details</h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-bold">Commenter</span>
                  <span className="font-bold text-slate-900 text-sm">@{selectedEvent.commenter_username}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-bold">Comment Text</span>
                  <span className="font-bold text-indigo-600 text-sm">"{selectedEvent.comment_text}"</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-bold mb-1">
                  Target Instagram Media / Post
                </span>
                <p className="font-semibold text-slate-900 bg-slate-100 p-2 rounded-lg">
                  {selectedEvent.post_title || 'Instagram Reel'} (Media ID: {selectedEvent.instagram_media_id})
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-emerald-50/50">
                  <span className="font-bold text-slate-900 block mb-1">Public Comment Reply</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {selectedEvent.public_reply_sent ? 'Sent ✓' : 'Not Sent'}
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-indigo-50/50">
                  <span className="font-bold text-slate-900 block mb-1">Private Instagram DM</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-indigo-700">
                    <Send className="h-4 w-4 text-indigo-600" />
                    {selectedEvent.dm_sent ? 'Sent ✓' : 'Not Sent'}
                  </span>
                </div>
              </div>

              {selectedEvent.error_message && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-rose-600" /> Meta API Error Response
                  </span>
                  <p className="text-[11px] leading-relaxed font-mono whitespace-pre-wrap">
                    {selectedEvent.error_message}
                  </p>
                </div>
              )}

              <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 flex justify-between">
                <span>Instagram Comment ID: {selectedEvent.instagram_comment_id}</span>
                <span>{new Date(selectedEvent.created_at).toLocaleString()}</span>
              </div>

            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
