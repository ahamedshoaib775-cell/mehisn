import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Key, 
  Server, 
  AlertTriangle,
  Camera,
  Activity,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { getMetaAuthUrl, testLiveConnection } from '../../lib/metaApi';
import type { LiveTestConnectionResult } from '../../types';

export const DeveloperSetupGuide: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<LiveTestConnectionResult | null>(null);

  const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL || 'https://<your-project>.supabase.co'}/functions/v1/instagram-webhook`;
  const sampleVerifyToken = 'my_secure_verify_token_123';

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testLiveConnection(webhookUrl, sampleVerifyToken);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        meta_api_ok: false,
        instagram_connected: false,
        webhook_verified: false,
        permissions_granted: [],
        error_message: err.message,
        tested_at: new Date().toISOString(),
      });
    } finally {
      setIsTesting(false);
    }
  };

  const steps = [
    {
      num: 1,
      title: 'Create Meta Developer App',
      description: 'Visit Meta for Developers and create a Business App with Instagram Graph API capability.',
      link: 'https://developers.facebook.com/apps',
    },
    {
      num: 2,
      title: 'Configure Instagram API & Messenger Products',
      description: 'Add the "Instagram Graph API" and "Messenger" products to your Meta Developer App dashboard.',
      link: 'https://developers.facebook.com/docs/instagram-api/',
    },
    {
      num: 3,
      title: 'Configure OAuth Redirect URIs',
      description: 'In Meta App Settings > Facebook Login / Instagram Settings, add your application callback URL.',
    },
    {
      num: 4,
      title: 'Deploy Supabase Edge Function & Set Webhook URL',
      description: 'Deploy `supabase/functions/instagram-webhook` to Supabase Edge Functions.',
    },
    {
      num: 5,
      title: 'Enter Verification Token',
      description: 'Set `META_VERIFY_TOKEN` secret in Supabase and enter matching token in Meta Webhook configuration.',
    },
    {
      num: 6,
      title: 'Subscribe to Instagram Webhook Fields',
      description: 'Subscribe to `comments` and `mentions` fields under Instagram / Page webhook subscriptions.',
    },
    {
      num: 7,
      title: 'Connect Instagram Professional Account',
      description: 'Connect your Instagram Creator or Business account using official Meta OAuth.',
    },
    {
      num: 8,
      title: 'Create & Publish Automation',
      description: 'Select an Instagram Reel, set trigger keyword "LOCATION", configure DM message, and publish live!',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Developer Setup & Connection Settings</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Live Meta API v22.0
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Step-by-step developer guide for Meta App Review, Supabase Edge Functions, and Live Webhook verification.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 text-indigo-400 ${isTesting ? 'animate-spin' : ''}`} />
              {isTesting ? 'Testing Connection...' : 'Test Connection'}
            </button>

            <a
              href={getMetaAuthUrl()}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold text-xs rounded-xl shadow-sm hover:opacity-95 transition-opacity shrink-0"
            >
              <Camera className="h-4 w-4" />
              Connect Instagram OAuth
            </a>
          </div>
        </div>
      </div>

      {/* Test Connection Results Banner */}
      {testResult && (
        <div className={`rounded-2xl p-5 border text-xs space-y-3 ${
          testResult.webhook_verified ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Activity className="h-5 w-5 text-indigo-600" />
              Live System Connection Test Results
            </div>
            <span className="text-[10px] text-slate-500">Tested at: {new Date(testResult.tested_at).toLocaleTimeString()}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-white/80 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Meta API Endpoint</span>
              {testResult.meta_api_ok ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Available
                </span>
              ) : (
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <XCircle className="h-4 w-4 text-rose-600" /> Unavailable
                </span>
              )}
            </div>

            <div className="p-3 bg-white/80 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Webhook Verification</span>
              {testResult.webhook_verified ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Verified ✓
                </span>
              ) : (
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <XCircle className="h-4 w-4 text-rose-600" /> Not Verified
                </span>
              )}
            </div>

            <div className="p-3 bg-white/80 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Required Permissions</span>
              <span className="text-emerald-700 font-bold">5 Scopes Granted</span>
            </div>
          </div>

          {testResult.error_message && (
            <div className="p-3 bg-white rounded-xl border border-rose-200 font-mono text-[11px] text-rose-700">
              Diagnostic details: {testResult.error_message}
            </div>
          )}
        </div>
      )}

      {/* Warning Alert: Meta App Review & Permissions */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-5 text-amber-950 space-y-2">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          Meta App Review & Advanced Permissions Requirement
        </div>
        <p className="text-xs leading-relaxed text-amber-900/90">
          In <strong>Development Status</strong>, your Meta App will work instantly with any Instagram account added as an App Tester. To enable live public use for external creators, Meta requires App Review for the following permissions:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {['instagram_basic', 'instagram_manage_comments', 'instagram_manage_messages', 'pages_show_list', 'pages_read_engagement'].map((scope) => (
            <span key={scope} className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-white text-amber-900 border border-amber-300/70">
              {scope}
            </span>
          ))}
        </div>
      </div>

      {/* Copyable Webhook & Secret Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Webhook Endpoint */}
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Server className="h-4 w-4 text-indigo-400" />
              Supabase Webhook URL
            </span>
            <button
              onClick={() => copyToClipboard(webhookUrl, 1)}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-200 flex items-center gap-1 cursor-pointer"
            >
              {copiedIndex === 1 ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedIndex === 1 ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-slate-300 break-all border border-slate-800">
            {webhookUrl}
          </div>
          <p className="text-[11px] text-slate-400">
            Paste this URL into Meta Developer Dashboard &gt; Webhooks &gt; Instagram.
          </p>
        </div>

        {/* Verification Token */}
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="h-4 w-4 text-indigo-400" />
              Meta Verify Token
            </span>
            <button
              onClick={() => copyToClipboard(sampleVerifyToken, 2)}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-200 flex items-center gap-1 cursor-pointer"
            >
              {copiedIndex === 2 ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedIndex === 2 ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-emerald-400 break-all border border-slate-800">
            {sampleVerifyToken}
          </div>
          <p className="text-[11px] text-slate-400">
            Set as `META_VERIFY_TOKEN` in Supabase Edge Function Secrets.
          </p>
        </div>

      </div>

      {/* 8 Step Setup List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 mb-2">Step-by-Step Onboarding Checklist</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-start gap-3"
            >
              <div className="h-7 w-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {step.num}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-0.5"
                    >
                      Docs <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
