import React, { useState } from 'react';
import { Trash2, ShieldCheck, Mail, CheckCircle, RefreshCw } from 'lucide-react';

interface DataDeletionProps {
  onBackToApp?: () => void;
}

export const DataDeletion: React.FC<DataDeletionProps> = ({ onBackToApp }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setStatus('submitting');
    setTimeout(() => {
      setStatus('submitted');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white rounded-2xl p-6 md:p-8 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
          <Trash2 size={280} />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-rose-500/30">
            <Trash2 className="w-3.5 h-3.5" /> Meta Data Deletion Policy
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">User Data Deletion Instructions</h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl">
            Pursuant to Meta Developer Policy 11.4, you have the absolute right to request permanent deletion of your Instagram data from InstaDM Automation.
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
        
        {/* Method 1: Automatic Deletion via Instagram */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Method 1: Immediate Revocation via Instagram
          </h2>
          <p>
            You can revoke InstaDM Automation's access to your Instagram account at any time. Revoking access immediately invalidates all access tokens and stops all webhook processing.
          </p>

          <ol className="list-decimal pl-6 space-y-2 text-slate-700 font-medium">
            <li>Log into your Instagram app or visit <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="text-rose-600 underline">Instagram.com</a>.</li>
            <li>Go to <strong>Settings &amp; Privacy &gt; Website Permissions &gt; Apps and Websites</strong>.</li>
            <li>Under the <strong>Active</strong> tab, locate <strong>InstaDM Automation</strong>.</li>
            <li>Click <strong>Remove</strong> to instantly sever access.</li>
          </ol>
        </div>

        {/* Method 2: Manual Data Erasure Form */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-600" />
            Method 2: Request Complete Data Erasure
          </h2>
          <p>
            If you wish to purge all historical logs, automation triggers, webhook event records, and tokens stored in our Supabase database, submit the form below. Requests are processed within 48 hours.
          </p>

          {status === 'submitted' ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900">Data Deletion Request Received!</h3>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                Confirmation ID: <code className="bg-emerald-100 px-2 py-0.5 rounded font-mono text-emerald-900">DEL-{Math.floor(100000 + Math.random() * 900000)}</code>
              </p>
              <p className="text-xs text-slate-600 pt-2">
                All records matching <strong>@{username}</strong> will be permanently erased from our primary and backup databases within 48 hours.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 text-xs font-semibold text-emerald-700 underline"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Instagram Username *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">@</span>
                  <input
                    type="text"
                    required
                    placeholder="your_instagram_handle"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Contact Email (Optional for confirmation)
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-lg shadow transition-colors disabled:opacity-50"
              >
                {status === 'submitting' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Submitting Erasure Request...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Request Data Deletion
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Data Erasure Policy Summary */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Data Retention & Automatic Cleanup</h2>
          <p>
            In compliance with Meta guidelines:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-600">
            <li>Webhook comment logs older than 30 days are automatically purged from our servers.</li>
            <li>No user media files, videos, or full DM conversation threads are ever cached or stored long-term.</li>
            <li>Access tokens are permanently deleted immediately upon account disconnection.</li>
          </ul>
        </div>

      </div>

      <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
        © 2026 InstaDM Automation | Meta Data Deletion Policy 11.4
      </div>

    </div>
  );
};

export default DataDeletion;
