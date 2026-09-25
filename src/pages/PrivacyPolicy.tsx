import React from 'react';
import { Shield, Lock, Eye, Trash2, CheckCircle2, Database, MessageSquare, UserCheck, Clock, Mail } from 'lucide-react';

interface PrivacyPolicyProps {
  onBackToApp?: () => void;
  onNavigateTab?: (tab: 'privacy' | 'data-deletion' | 'terms') => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBackToApp, onNavigateTab }) => {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 md:p-8 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
          <Shield size={280} />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-rose-500/30">
            <Shield className="w-3.5 h-3.5" /> Meta Compliant Policy
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl">
            Effective Date: September 25, 2026 | Last Updated: September 25, 2026
          </p>
          <p className="text-slate-400 text-xs mt-2">
            This Privacy Policy outlines how InstaDM Automation (AutoDM) collects, uses, stores, and protects your information in compliance with Meta Developer Policies and Instagram Graph API Standards.
          </p>
          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 font-semibold text-sm rounded-lg hover:bg-slate-100 transition-colors shadow"
            >
              ← Back to Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
        
        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 text-slate-900 font-semibold mb-2">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <Lock className="w-5 h-5" />
              </div>
              <span>No Password Storage</span>
            </div>
            <p className="text-xs text-slate-500">
              We connect securely via Meta OAuth 2.0. We never see or store your Instagram password.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 text-slate-900 font-semibold mb-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Eye className="w-5 h-5" />
              </div>
              <span>Targeted API Access</span>
            </div>
            <p className="text-xs text-slate-500">
              We access comment webhooks strictly to trigger requested links and location DMs.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 text-slate-900 font-semibold mb-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Trash2 className="w-5 h-5" />
              </div>
              <span>Instant Data Deletion</span>
            </div>
            <p className="text-xs text-slate-500">
              Revoke permissions in Instagram settings or request database erasure anytime.
            </p>
          </div>
        </div>

        {/* 1. Instagram API Usage */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            1. Instagram API Usage
          </h2>
          <p>
            InstaDM Automation utilizes official <strong>Instagram Graph API (v22.0)</strong> endpoints to provide comment-to-DM marketing automation for Business and Creator accounts.
          </p>
          <p>
            Our API integration uses approved permissions including <code>instagram_basic</code>, <code>instagram_manage_comments</code>, and <code>instagram_manage_messages</code>. We adhere strictly to Meta Developer Platform Terms and API Rate Limits.
          </p>
        </div>

        {/* 2. Comments and Messages */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-rose-600" />
            2. Comments and Messages Data Processing
          </h2>
          <p>
            To trigger automated workflows, our app processes incoming webhook notifications when users comment on your Instagram posts:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
            <li><strong>Comments:</strong> We analyze incoming comment text for configured trigger keywords (e.g. "LOCATION", "LINK"). We do not analyze unassociated posts or comments.</li>
            <li><strong>Direct Messages:</strong> In response to valid keyword matches, our app sends automated Direct Messages containing requested links or location details.</li>
            <li><strong>Public Replies:</strong> Optional public comment confirmation replies (e.g., "Check your DMs! 📩") are posted to inform users.</li>
          </ul>
        </div>

        {/* 3. Account Information */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            3. Account Information We Collect
          </h2>
          <p>When you authorize your account, we access basic public account details needed to render your dashboard:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-medium">Instagram User ID & Username</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-medium">Profile Picture URL & Account Type</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-medium">Follower Count & Connected Page ID</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-medium">Encrypted Access Tokens</span>
            </div>
          </div>
        </div>

        {/* 4. Data Storage & Supabase */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-sky-600" />
            4. Data Storage & Supabase Infrastructure
          </h2>
          <p>
            Your account configurations, active automation rules, and trigger logs are stored securely using <strong>Supabase (PostgreSQL)</strong> database infrastructure with Row Level Security (RLS).
          </p>
          <p>
            All data in transit is encrypted using <strong>TLS 1.3 / SSL</strong>, and access tokens stored in Supabase are protected with AES-256 encryption. We do not sell or monetize your data.
          </p>
        </div>

        {/* 5. Data Retention */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            5. Data Retention Policy
          </h2>
          <p>
            We retain data only as long as necessary to maintain active service:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-600">
            <li><strong>Webhook Activity Logs:</strong> Stored for up to 30 days for analytics and debugging, after which they are automatically purged.</li>
            <li><strong>Access Tokens:</strong> Retained while your account remains connected. Tokens are deleted immediately upon disconnection.</li>
            <li><strong>Media Content:</strong> We do not cache or store full Instagram video/image media files long-term.</li>
          </ul>
        </div>

        {/* 6. User Deletion Requests */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-600" />
            6. User Deletion Requests
          </h2>
          <p>
            You have the absolute right to request deletion of all your stored data. You can disconnect access via Instagram settings or submit a request on our dedicated Data Deletion page.
          </p>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-900">Need to request complete data erasure?</p>
              <p className="text-xs text-slate-600">Visit our Data Deletion page for step-by-step instructions and request form.</p>
            </div>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('data-deletion')}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg shadow transition-colors whitespace-nowrap"
              >
                Go to Data Deletion Page →
              </button>
            )}
          </div>
        </div>

        {/* 7. Contact Information */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-600" />
            7. Contact Information
          </h2>
          <p>
            If you have questions regarding this Privacy Policy or data security, reach out to our team:
          </p>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
            <p><strong>InstaDM Developer Support</strong></p>
            <p>Email: <a href="mailto:privacy@instadm.app" className="text-rose-600 underline">privacy@instadm.app</a> / <a href="mailto:support@instadm.app" className="text-rose-600 underline">support@instadm.app</a></p>
          </div>
        </div>

      </div>

      {/* Footer Links */}
      <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© 2026 InstaDM Automation. All rights reserved.</span>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigateTab?.('privacy')}
            className="hover:text-slate-900 font-medium cursor-pointer"
          >
            Privacy Policy
          </button>
          <span>|</span>
          <button 
            onClick={() => onNavigateTab?.('data-deletion')}
            className="hover:text-slate-900 font-medium cursor-pointer"
          >
            Data Deletion
          </button>
          <span>|</span>
          <button 
            onClick={() => onNavigateTab?.('terms')}
            className="hover:text-slate-900 font-medium cursor-pointer"
          >
            Terms of Service
          </button>
        </div>
      </div>

    </div>
  );
};

export default PrivacyPolicy;
