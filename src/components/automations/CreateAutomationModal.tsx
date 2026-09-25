import React, { useState, useEffect } from 'react';
import type { Automation, InstagramPost, MatchType } from '../../types';
import { X, Sparkles, Check } from 'lucide-react';

interface CreateAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (automation: Partial<Automation>) => void;
  posts: InstagramPost[];
  editingAutomation?: Automation | null;
  selectedPostId?: string | null;
}

export const CreateAutomationModal: React.FC<CreateAutomationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  posts,
  editingAutomation,
  selectedPostId,
}) => {
  const [postId, setPostId] = useState<string>(posts[0]?.id || '');
  const [keyword, setKeyword] = useState<string>('LOCATION');
  const [keywordsList, setKeywordsList] = useState<string[]>(['LOCATION', 'LOC', 'WHERE', 'ADDRESS']);
  const [newKwInput, setNewKwInput] = useState<string>('');
  const [matchType, setMatchType] = useState<MatchType>('exact');
  const [publicReply, setPublicReply] = useState<string>('Sent it to your DMs 📩✨');
  const [dmMessage, setDmMessage] = useState<string>(
    "Hey! 👋\n\nHere's the location you asked for 📍\n\nTap the button below to open the location.\n\nEnjoy your visit! ✨"
  );
  const [locationName, setLocationName] = useState<string>('Example Cafe');
  const [locationUrl, setLocationUrl] = useState<string>('https://maps.google.com/?q=Example+Cafe');
  const [active, setActive] = useState<boolean>(true);

  useEffect(() => {
    if (editingAutomation) {
      setPostId(editingAutomation.post_id);
      setKeyword(editingAutomation.keyword);
      setKeywordsList(editingAutomation.keywords || [editingAutomation.keyword]);
      setMatchType(editingAutomation.match_type || 'exact');
      setPublicReply(editingAutomation.public_reply);
      setDmMessage(editingAutomation.dm_message);
      setLocationName(editingAutomation.location_name || '');
      setLocationUrl(editingAutomation.location_url || '');
      setActive(editingAutomation.active);
    } else if (selectedPostId) {
      setPostId(selectedPostId);
    }
  }, [editingAutomation, selectedPostId]);

  if (!isOpen) return null;

  const handleAddKeyword = () => {
    if (newKwInput.trim() && !keywordsList.includes(newKwInput.trim().toUpperCase())) {
      const updated = [...keywordsList, newKwInput.trim().toUpperCase()];
      setKeywordsList(updated);
      if (!keyword) setKeyword(updated[0]);
      setNewKwInput('');
    }
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    const updated = keywordsList.filter((k) => k !== kwToRemove);
    setKeywordsList(updated);
    if (keyword === kwToRemove) {
      setKeyword(updated[0] || 'LOCATION');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalKeywords = keywordsList.length > 0 ? keywordsList : [keyword || 'LOCATION'];
    onSave({
      id: editingAutomation?.id,
      post_id: postId,
      keyword: finalKeywords[0],
      keywords: finalKeywords,
      match_type: matchType,
      public_reply: publicReply,
      dm_message: dmMessage,
      location_name: locationName,
      location_url: locationUrl,
      active,
    });
    onClose();
  };

  const currentSelectedPost = posts.find((p) => p.id === postId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {editingAutomation ? 'Edit Automation' : 'Create New Automation'}
              </h3>
              <p className="text-xs text-slate-500">Configure public reply & private DM trigger rule</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* 1. Select Post / Reel */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Instagram Post / Reel *
            </label>
            <select
              value={postId}
              onChange={(e) => setPostId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
            >
              {posts.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.media_type}] {p.caption.slice(0, 60)}... ({new Date(p.published_at).toLocaleDateString()})
                </option>
              ))}
            </select>

            {currentSelectedPost && (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <img
                  src={currentSelectedPost.thumbnail_url}
                  alt={currentSelectedPost.caption}
                  className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-900 line-clamp-1">
                    {currentSelectedPost.caption}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Media ID: {currentSelectedPost.instagram_media_id}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Trigger Keywords + Match Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Trigger Keywords *
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. LOCATION, WHERE, ADDRESS"
                  value={newKwInput}
                  onChange={(e) => setNewKwInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddKeyword();
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddKeyword}
                  className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>

              {/* Keyword Badges */}
              <div className="flex flex-wrap gap-1.5">
                {keywordsList.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200"
                  >
                    {kw}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(kw)}
                      className="text-indigo-400 hover:text-indigo-700 ml-0.5 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Match Rule
              </label>
              <select
                value={matchType}
                onChange={(e) => setMatchType(e.target.value as MatchType)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                <option value="exact">Exact Keyword</option>
                <option value="contains">Contains Keyword</option>
              </select>
            </div>
          </div>

          {/* 3. Public Comment Reply */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Public Comment Reply *
            </label>
            <input
              type="text"
              required
              value={publicReply}
              onChange={(e) => setPublicReply(e.target.value)}
              placeholder="e.g. Sent it to your DMs 📩✨"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* 4. DM Message Text */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Private DM Message Content *
            </label>
            <textarea
              required
              rows={4}
              value={dmMessage}
              onChange={(e) => setDmMessage(e.target.value)}
              placeholder="Hey! Here's the location you asked for..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* 5. Location Name & Google Maps Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Location Name
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Example Cafe Chennai"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Google Maps URL
              </label>
              <input
                type="url"
                value={locationUrl}
                onChange={(e) => setLocationUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* 6. Active Status Switch */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Automation Status</span>
              <span className="text-[11px] text-slate-500">Enable or pause live webhook triggers</span>
            </div>
            <button
              type="button"
              onClick={() => setActive(!active)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                active
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {active ? 'Active (ON)' : 'Paused (OFF)'}
            </button>
          </div>

          {/* Footer Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-rose-500 to-purple-600 hover:opacity-95 text-white font-semibold text-xs rounded-xl shadow-md transition-opacity flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="h-4 w-4" />
              Save Automation
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
