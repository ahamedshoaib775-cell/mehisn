import React from 'react';
import { FileText, Shield } from 'lucide-react';

interface TermsOfServiceProps {
  onBackToApp?: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBackToApp }) => {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 md:p-8 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
          <FileText size={280} />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-indigo-500/30">
            <Shield className="w-3.5 h-3.5" /> Terms of Service
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Terms of Service</h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl">
            Effective Date: September 25, 2026 | Last Updated: September 25, 2026
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

      <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
        
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using <strong>InstaDM Automation</strong> ("the Service"), you agree to be bound by these Terms of Service and all applicable laws and Meta Platform Terms.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Instagram API & Account Responsibilities</h2>
          <p>
            You are responsible for maintaining the security of your Instagram account credentials and Meta access tokens.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must comply with Instagram Community Guidelines and Meta Spam Policies.</li>
            <li>You agree not to use the Service to send unwanted spam, harassing messages, or unlawful content via Instagram Direct Messages.</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Service Availability & Modification</h2>
          <p>
            We strive for 99.9% uptime, but availability depends on Meta Graph API endpoints and Supabase database infrastructure. We reserve the right to modify or discontinue any feature of the Service at any time.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Limitation of Liability</h2>
          <p>
            In no event shall InstaDM Automation be liable for any indirect, incidental, special, or consequential damages resulting from your use or inability to use the Service or Instagram API rate-limiting events.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900">5. Contact Information</h2>
          <p>
            For any legal or terms inquiries, please contact: <strong className="text-rose-600">terms@instadm.app</strong>
          </p>
        </div>

      </div>

      <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
        © 2026 InstaDM Automation. All rights reserved.
      </div>

    </div>
  );
};

export default TermsOfService;
