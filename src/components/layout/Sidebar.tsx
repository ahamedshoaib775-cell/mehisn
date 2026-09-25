import React from 'react';
import type { ActiveTab } from '../../types';
import { 
  LayoutDashboard, 
  Zap, 
  Film, 
  Activity, 
  Sliders, 
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeAutomationsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeAutomationsCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'automations' as ActiveTab,
      label: 'Automations',
      icon: Zap,
      badge: activeAutomationsCount > 0 ? activeAutomationsCount : null,
    },
    {
      id: 'posts' as ActiveTab,
      label: 'Instagram Posts',
      icon: Film,
      badge: null,
    },
    {
      id: 'activity' as ActiveTab,
      label: 'Activity Log',
      icon: Activity,
      badge: null,
    },
    {
      id: 'setup' as ActiveTab,
      label: 'Settings & Setup',
      icon: Sliders,
      badge: null,
    },
    {
      id: 'privacy' as ActiveTab,
      label: 'Privacy Policy',
      icon: ShieldCheck,
      badge: null,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-4 shrink-0 flex flex-col justify-between">
      <div>
        <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Navigation
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      isActive ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Meta API Status Footer */}
      <div className="mt-8 pt-4 border-t border-slate-200">
        <div className="bg-slate-900 text-slate-100 rounded-xl p-3.5 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Meta Graph API
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-[11px] text-slate-400 mb-2.5 leading-relaxed">
            Live Webhooks & Messaging API v22.0 active.
          </p>
          <button
            onClick={() => setActiveTab('setup')}
            className="w-full text-center py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
          >
            View Live API Status
          </button>
        </div>
      </div>
    </aside>
  );
};
