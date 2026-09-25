import React from 'react';
import { Shield, Lock, Eye, Trash2, CheckCircle2, FileText } from 'lucide-react';

interface PrivacyPolicyProps {
  onBackToApp?: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBackToApp }) => {
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
            This Privacy Policy outlines how InstaDM Automation collects, uses, stores, and protects your information in compliance with Meta Developer Policies and Instagram Graph API Standards.
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

      {/* Main Content Cards */}
      <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
        
        {/* Quick Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-3 text-slate-900 font-semibold mb-2">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <Lock className="w-5 h-5" />
              </div>
              <span>No Password Storage</span>
            </div>
            <p className="text-xs text-slate-500">
              We connect via official Meta OAuth 2.0. We never see or store your Instagram password.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-3 text-slate-900 font-semibold mb-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Eye className="w-5 h-5" />
              </div>
              <span>Limited Data Usage</span>
            </div>
            <p className="text-xs text-slate-500">
              We process comments and posts solely to send requested links & location DMs to your audience.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-3 text-slate-900 font-semibold mb-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Trash2 className="w-5 h-5" />
              </div>
              <span>Instant Data Deletion</span>
            </div>
            <p className="text-xs text-slate-500">
              Disconnect access anytime in Instagram settings or request complete data erasure.
            </p>
          </div>
        </div>

        {/* Section 1: Overview & Scope */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            1. Overview & Scope
          </h2>
          <p>
            <strong>InstaDM Automation</strong> ("we", "our", or "the Service") provides social media automation tools for Instagram Business and Creator accounts. This Privacy Policy applies to all users who connect their Instagram accounts to our platform.
          </p>
          <p>
            By authorizing our application through Meta OAuth, you agree to the collection and use of information in accordance with this policy and Meta’s Platform Terms.
          </p>
        </div>

        {/* Section 2: Information We Collect */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            2. Information We Collect via Meta API
          </h2>
          <p>
            When you connect your Instagram account, we access specific data granted through Meta permissions:
          </p>

          <div className="space-y-3 pl-2">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
              <div>
                <strong>Instagram Account Information:</strong> Your Instagram User ID, username, profile picture URL, account type (Business/Creator), and follower count.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
              <div>
                <strong>Post & Media Data:</strong> Media IDs, captions, permalinks, media types (Reel/Image), and publication timestamps for posts you select for automation.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
              <div>
                <strong>Comment Data & Webhook Payloads:</strong> Incoming comment text, comment IDs, commenter usernames, and commenter scoped IDs processed to match automation triggers (e.g. keywords like "LOCATION").
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
              <div>
                <strong>Access Tokens:</strong> Encrypted long-lived access tokens required to perform API requests (messaging and public comment replies) on your behalf.
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: How We Use Your Information */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-600" />
            3. How We Use Information
          </h2>
          <p>We strictly use collected information to provide and improve the Service:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Automated DM Delivery:</strong> Sending requested link/location details in response to comment triggers on your specified posts.</li>
            <li><strong>Public Comment Replies:</strong> Posting optional public confirmation replies (e.g., "Check your DMs!") on your posts.</li>
            <li><strong>Analytics & Logs:</strong> Displaying execution history, trigger counts, and message delivery statuses inside your dashboard.</li>
            <li><strong>Service Maintenance:</strong> Debugging webhook delivery issues and ensuring API rate limit compliance.</li>
          </ul>
        </div>

        {/* Section 4: Data Sharing & Third Parties */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" />
            4. Data Sharing & Third-Party Disclosure
          </h2>
          <p>
            <strong>We do NOT sell, rent, trade, or monetize your personal or account data under any circumstances.</strong>
          </p>
          <p>Data is shared strictly with essential service providers operating under strict confidentiality:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Meta Platform / Instagram Graph API:</strong> For processing webhooks and executing API calls.</li>
            <li><strong>Database & Infrastructure Providers (Supabase):</strong> For encrypted storage of configuration and event logs.</li>
          </ul>
        </div>

        {/* Section 5: Data Retention & Deletion Instructions */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-600" />
            5. User Rights & Data Deletion Instructions
          </h2>
          <p>
            You retain full ownership and control of your data at all times.
          </p>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
            <h3 className="font-semibold text-slate-900">How to Revoke Access & Delete Your Data:</h3>
            
            <div className="space-y-2 text-xs md:text-sm">
              <p><strong>Option A: Revoke via Instagram Settings</strong></p>
              <ol className="list-decimal pl-5 space-y-1 text-slate-600">
                <li>Log in to your Instagram account on mobile or desktop.</li>
                <li>Go to <strong>Settings & Privacy &gt; Website Permissions &gt; Apps and Websites</strong>.</li>
                <li>Find <strong>InstaDM Automation</strong> and click <strong>Remove</strong>.</li>
              </ol>
            </div>

            <div className="space-y-2 text-xs md:text-sm pt-2">
              <p><strong>Option B: Request Manual Account Erasure</strong></p>
              <p className="text-slate-600">
                To request immediate permanent deletion of all stored logs, tokens, and account records from our database, contact us at <a href="mailto:privacy@instadm.app" className="text-rose-600 underline font-medium">privacy@instadm.app</a>. We will fulfill data erasure requests within 48 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Section 6: Security & Contact */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900">6. Security & Contact Information</h2>
          <p>
            We enforce industry-standard security measures including SSL/TLS encryption for all data in transit and AES-256 encryption at rest.
          </p>
          <div className="pt-2 text-slate-600">
            <p>If you have any questions regarding this Privacy Policy, please contact:</p>
            <p className="font-medium text-slate-900 mt-1">InstaDM Developer Support</p>
            <p className="text-rose-600">Email: support@instadm.app / privacy@instadm.app</p>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© 2026 InstaDM Automation. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-900 cursor-pointer">Terms of Service</span>
          <span>•</span>
          <span className="hover:text-slate-900 cursor-pointer">Data Deletion Policy</span>
        </div>
      </div>

    </div>
  );
};

export default PrivacyPolicy;
