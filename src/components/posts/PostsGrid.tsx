import React from 'react';
import type { InstagramPost, Automation } from '../../types';
import { Film, MessageSquare, Heart, Plus, Check } from 'lucide-react';

interface PostsGridProps {
  posts: InstagramPost[];
  automations: Automation[];
  onCreateAutomationForPost: (postId: string) => void;
}

export const PostsGrid: React.FC<PostsGridProps> = ({
  posts,
  automations,
  onCreateAutomationForPost,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Instagram Posts & Reels</h2>
          <p className="text-xs text-slate-500">
            Available media from connected Instagram Professional API
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          <Film className="h-4 w-4 text-slate-600" />
          <span>Showing {posts.length} API Posts</span>
        </div>
      </div>

      {/* Media Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {posts.map((post) => {
          const existingAutomations = automations.filter((a) => a.post_id === post.id);
          const hasActiveAuto = existingAutomations.some((a) => a.active);

          return (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              {/* Media Thumbnail */}
              <div className="relative group aspect-square bg-slate-900 overflow-hidden">
                <img
                  src={post.thumbnail_url}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Media Type Badge */}
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 border border-white/10">
                  <Film className="h-3 w-3 text-rose-400" />
                  {post.media_type}
                </div>

                {/* Active Automation Tag */}
                {hasActiveAuto && (
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Automated
                  </div>
                )}

                {/* Stats Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
                    {post.comments_count || 0} comments
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5 text-rose-400" />
                    {post.like_count || 0}
                  </span>
                </div>
              </div>

              {/* Caption & Published Date */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 line-clamp-2 leading-relaxed">
                    {post.caption}
                  </h3>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Published {new Date(post.published_at).toLocaleString()}
                  </span>
                </div>

                {/* Active Keyword Rule Summary */}
                {existingAutomations.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                    {existingAutomations.map((a) => (
                      <span
                        key={a.id}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200"
                      >
                        Trigger: {a.keyword}
                      </span>
                    ))}
                  </div>
                )}

                {/* Create Automation CTA Button */}
                <button
                  onClick={() => onCreateAutomationForPost(post.id)}
                  className="w-full mt-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-4 w-4 text-rose-400" />
                  Create Automation
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
