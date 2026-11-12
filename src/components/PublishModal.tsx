import React, { useState } from 'react';
import { PlatformId, PublishedPlatformResult, PublishResult, PublishStep } from '../types';
import {
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  X,
  Sparkles,
  Layers,
  ArrowRight,
  Share2,
} from 'lucide-react';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPublishing: boolean;
  steps: PublishStep[];
  overallProgress: number;
  result: PublishResult | null;
  selectedPlatforms: Record<PlatformId, boolean>;
  onResetForNewPost: () => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  isPublishing,
  steps,
  overallProgress,
  result,
  selectedPlatforms,
  onResetForNewPost,
}) => {
  const [copiedLinkIndex, setCopiedLinkIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedLinkIndex(index);
    setTimeout(() => setCopiedLinkIndex(null), 2000);
  };

  const copyAllLinks = (results: PublishedPlatformResult[]) => {
    const text = results.map((r) => `${r.platform.toUpperCase()}: ${r.url}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const getPlatformIcon = (id: PlatformId) => {
    switch (id) {
      case 'youtube':
        return (
          <div className="w-5 h-5 rounded bg-red-600 flex items-center justify-center text-white text-[10px] font-black">
            ▶
          </div>
        );
      case 'instagram':
        return (
          <div className="w-5 h-5 rounded bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
            ◎
          </div>
        );
      case 'tiktok':
        return (
          <div className="w-5 h-5 rounded bg-black border border-cyan-400 flex items-center justify-center text-cyan-300 text-[10px] font-black">
            ♪
          </div>
        );
      case 'facebook':
        return (
          <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">
            f
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              {result?.success ? (
                <Sparkles className="w-5 h-5 text-emerald-400" />
              ) : (
                <Layers className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {result?.success
                  ? result.isScheduled
                    ? 'Posts Scheduled Successfully!'
                    : 'Cross-Posting Broadcast Complete!'
                  : 'Distributing Video to Short-Form Feeds'}
              </h3>
              <p className="text-xs text-slate-400">
                {result?.success
                  ? 'All targeted platforms processed and live'
                  : 'Multi-platform API parallel pipeline active'}
              </p>
            </div>
          </div>

          {!isPublishing && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Overall Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300">
                {result?.success ? 'Broadcast 100% Complete' : 'Publishing Progress'}
              </span>
              <span className="font-mono text-indigo-400">{overallProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  result?.success
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : 'bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400'
                }`}
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* Step-by-Step Progress List */}
          <div className="space-y-2.5">
            {steps.map((step) => {
              const isDone = step.status === 'completed';
              const isInProgress = step.status === 'in_progress';

              return (
                <div
                  key={step.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    isDone
                      ? 'bg-slate-950/40 border-slate-800/80'
                      : isInProgress
                      ? 'bg-indigo-950/30 border-indigo-500/50 shadow-md ring-1 ring-indigo-500/20'
                      : 'bg-slate-950/20 border-slate-800/40 opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Status Icon */}
                    <div className="mt-0.5">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isInProgress ? (
                        <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {step.platform && getPlatformIcon(step.platform)}
                        <h4
                          className={`text-xs font-bold ${
                            isDone
                              ? 'text-slate-200'
                              : isInProgress
                              ? 'text-indigo-300'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Badge */}
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                      isDone
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold'
                        : isInProgress
                        ? 'bg-indigo-500/20 text-indigo-300 font-semibold animate-pulse'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isDone ? 'Success' : isInProgress ? 'Sending...' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Results Box with direct simulated URLs when completed */}
          {result?.success && (
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Live Post Links:
                </span>
                <button
                  type="button"
                  onClick={() => copyAllLinks(result.publishedPlatforms)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? 'All Copied!' : 'Copy All Links'}</span>
                </button>
              </div>

              <div className="space-y-2">
                {result.publishedPlatforms.map((pub, idx) => (
                  <div
                    key={pub.platform}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {getPlatformIcon(pub.platform)}
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-slate-200 capitalize">
                          {pub.platform} Shorts / Reel
                        </span>
                        <p className="text-[10px] text-slate-400 font-mono truncate max-w-[200px] sm:max-w-xs">
                          {pub.url}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(pub.url, idx)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Copy post link"
                      >
                        {copiedLinkIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium border border-indigo-500/30 transition-colors"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-end gap-3">
          {result?.success ? (
            <>
              <button
                type="button"
                onClick={onResetForNewPost}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Publish Another Video
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-lg shadow-indigo-500/20"
              >
                Done
              </button>
            </>
          ) : (
            <span className="text-xs text-slate-500 italic">
              Please do not close this window while videos are being dispatched...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
