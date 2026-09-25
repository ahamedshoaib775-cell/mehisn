import React from 'react';
import type { ActiveTab } from '../../types';

interface FooterProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span>© 2026 InstaDM Automation (AutoDM). All rights reserved.</span>
        </div>
        
        <div className="flex items-center gap-3 font-medium text-slate-600">
          <button
            onClick={() => onNavigateTab('privacy')}
            className="hover:text-rose-600 transition-colors"
          >
            Privacy Policy
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => onNavigateTab('data-deletion')}
            className="hover:text-rose-600 transition-colors"
          >
            Data Deletion
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => onNavigateTab('terms')}
            className="hover:text-rose-600 transition-colors"
          >
            Terms of Service
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
