import React from 'react';
import type { InstagramAccount } from '../../types';
import { 
  CheckCircle2, 
  Zap, 
  ShieldCheck,
  Camera,
  AlertCircle
} from 'lucide-react';

interface HeaderProps {
  account: InstagramAccount | null;
  onConnectInstagram: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  account,
  onConnectInstagram,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3.5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Left: App Title & Status */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-md shadow-rose-500/10 text-white font-bold text-lg">
            <Zap className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 text-lg tracking-tight">AutoDM</h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Live Meta API
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Official Instagram Comment-to-DM Platform
            </p>
          </div>
        </div>

        {/* Right Controls: Account Status & Connection */}
        <div className="flex items-center gap-3">
          
          {/* Live System Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Production Live System
          </div>

          {/* Connected Instagram Account Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            {account && account.is_connected ? (
              <div 
                onClick={onOpenSettings}
                className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
                title="View Instagram Connection & API Settings"
              >
                {account.profile_picture_url ? (
                  <img
                    src={account.profile_picture_url}
                    alt={account.username}
                    className="h-7 w-7 rounded-full object-cover ring-2 ring-rose-500/20"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs">
                    {account.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left hidden md:block">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-slate-900">@{account.username}</span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                  <span className="text-[10px] text-slate-500 capitalize">
                    Connected • Live
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 font-medium">
                  <AlertCircle className="h-3.5 w-3.5" />
                  No Account Linked
                </div>
                <button
                  onClick={onConnectInstagram}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:opacity-95 transition-opacity"
                >
                  <Camera className="h-4 w-4" />
                  Connect Instagram
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
