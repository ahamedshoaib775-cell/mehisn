import React, { useState } from 'react';
import type { Automation } from '../../types';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Sparkles, 
  MapPin, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface AutomationsListProps {
  automations: Automation[];
  onNewAutomation: () => void;
  onEditAutomation: (auto: Automation) => void;
  onToggleStatus: (id: string) => void;
  onDeleteAutomation: (id: string) => void;
}

export const AutomationsList: React.FC<AutomationsListProps> = ({
  automations,
  onNewAutomation,
  onEditAutomation,
  onToggleStatus,
  onDeleteAutomation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = automations.filter(
    (auto) =>
      auto.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (auto.post?.caption && auto.post.caption.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Automations</h2>
          <p className="text-xs text-slate-500">
            Automated comment trigger rules and Instagram DM responses
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search keyword or post..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 w-full sm:w-64 bg-white"
            />
          </div>

          <button
            onClick={onNewAutomation}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 hover:opacity-95 text-white font-semibold text-xs rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create Automation
          </button>
        </div>
      </div>

      {/* Automations Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Automations Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No automations match your search criteria. Create a new automation to begin sending auto-DMs.
          </p>
          <button
            onClick={onNewAutomation}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl shadow-sm hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Create Automation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((auto) => (
            <div
              key={auto.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-sm ${
                auto.active ? 'border-slate-200 hover:border-slate-300' : 'border-slate-200 opacity-75 bg-slate-50/50'
              }`}
            >
              {/* Post Thumbnail & Status Header */}
              <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  {auto.post?.thumbnail_url ? (
                    <img
                      src={auto.post.thumbnail_url}
                      alt={auto.post.caption}
                      className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      <Sparkles className="h-6 w-6 text-slate-400" />
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-semibold text-indigo-600 block mb-0.5">
                      {auto.post?.media_type || 'REEL'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {auto.post?.caption || 'Instagram Reel'}
                    </h3>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Created {new Date(auto.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Status Toggle Switch */}
                <button
                  onClick={() => onToggleStatus(auto.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    auto.active
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-200 text-slate-600 border border-slate-300'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${auto.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {auto.active ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Automation Details */}
              <div className="space-y-3">
                
                {/* Trigger Keywords */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Trigger Keywords ({auto.match_type})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[auto.keyword, ...(auto.keywords || [])].map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Public Reply Preview */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Public Reply
                  </span>
                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="italic">{auto.public_reply}</span>
                  </p>
                </div>

                {/* DM Message Preview */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Private DM Message
                  </span>
                  <div className="text-xs text-slate-800 bg-slate-900 text-slate-100 p-3 rounded-xl space-y-1.5">
                    <p className="whitespace-pre-line text-[11px] leading-relaxed">{auto.dm_message}</p>
                    {auto.location_url && (
                      <a
                        href={auto.location_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-600 text-white font-semibold text-[10px] rounded-lg mt-1 hover:bg-rose-700 transition-colors"
                      >
                        <MapPin className="h-3 w-3" />
                        📍 Open Location ({auto.location_name || 'Maps Link'})
                      </a>
                    )}
                  </div>
                </div>

              </div>

              {/* Bottom Footer Stats & Action Buttons */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="font-bold text-slate-900">{auto.trigger_count.toLocaleString()} triggers</span>
                  <span>•</span>
                  <span className="font-bold text-emerald-600">{auto.dm_sent_count.toLocaleString()} DMs sent</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditAutomation(auto)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                    title="Edit Automation"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setDeleteId(auto.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                    title="Delete Automation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-xl space-y-4">
            <div className="h-10 w-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Automation?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this comment-to-DM automation? Incoming comment webhooks will no longer send DMs for this post.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteAutomation(deleteId);
                  setDeleteId(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
