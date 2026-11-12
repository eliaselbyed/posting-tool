import React, { useState } from 'react';
import { SAMPLE_TOPICS } from '../services/publishService';
import { Sparkles, Copy, Check, Hash, Lightbulb, ArrowDownToLine } from 'lucide-react';

interface MasterTopicSectionProps {
  masterTopic: string;
  onMasterTopicChange: (topic: string) => void;
  masterCaption: string;
  onMasterCaptionChange: (caption: string) => void;
  onGenerateAI: () => Promise<void>;
  isGeneratingAI: boolean;
  onSyncMasterToAll: () => void;
  enabledPlatformCount: number;
}

export const MasterTopicSection: React.FC<MasterTopicSectionProps> = ({
  masterTopic,
  onMasterTopicChange,
  masterCaption,
  onMasterCaptionChange,
  onGenerateAI,
  isGeneratingAI,
  onSyncMasterToAll,
  enabledPlatformCount,
}) => {
  const [justSynced, setJustSynced] = useState(false);

  const handleSync = () => {
    onSyncMasterToAll();
    setJustSynced(true);
    setTimeout(() => setJustSynced(false), 2200);
  };

  const addHashtag = (tag: string) => {
    if (!masterCaption.includes(tag)) {
      const updated = masterCaption ? `${masterCaption.trim()} ${tag}` : tag;
      onMasterCaptionChange(updated);
    }
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              AI Caption Studio & Master Sync
            </h3>
            <p className="text-xs text-slate-400">
              Generate platform-tailored hooks or sync a universal master caption
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
          Auto-Tailor v2.4
        </span>
      </div>

      {/* Topic Input & AI Generator Button */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-300">
          Master Topic / Video Notes
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={masterTopic}
              onChange={(e) => onMasterTopicChange(e.target.value)}
              placeholder="e.g. 3 secret AI tools that save 10 hours a week..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>

          <button
            type="button"
            disabled={isGeneratingAI}
            onClick={onGenerateAI}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-md shrink-0 ${
              isGeneratingAI
                ? 'bg-indigo-600/50 text-indigo-200 cursor-wait'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/20 active:scale-[0.98]'
            }`}
          >
            {isGeneratingAI ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Writing Captions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Generate AI Captions</span>
              </>
            )}
          </button>
        </div>

        {/* Suggestion Topic Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-400" />
            Try:
          </span>
          {SAMPLE_TOPICS.map((topic, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onMasterTopicChange(topic)}
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
            >
              "{topic.slice(0, 32)}..."
            </button>
          ))}
        </div>
      </div>

      {/* Master Caption Textarea */}
      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <span>Master Caption</span>
            <span className="text-[10px] text-slate-500 font-normal">
              (Source for 1-click sync)
            </span>
          </label>
          <span className="text-[11px] font-mono text-slate-400">
            {masterCaption.length} chars
          </span>
        </div>

        <textarea
          rows={3}
          value={masterCaption}
          onChange={(e) => onMasterCaptionChange(e.target.value)}
          placeholder="Write your universal caption here, then click 'Sync to All' to instantly propagate to all enabled platforms below..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-y"
        />

        {/* Quick Hashtag Chips & Sync Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
              <Hash className="w-3 h-3 text-slate-400" />
              Tags:
            </span>
            {['#shorts', '#reels', '#fyp', '#viral', '#tech', '#trending'].map(
              (tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addHashtag(tag)}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-mono transition-colors"
                >
                  {tag}
                </button>
              )
            )}
          </div>

          {/* Sync Button */}
          <button
            type="button"
            onClick={handleSync}
            disabled={!masterCaption.trim()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
              justSynced
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : !masterCaption.trim()
                ? 'bg-slate-800/40 text-slate-500 border border-slate-800 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500 shadow-indigo-500/20 active:scale-95'
            }`}
          >
            {justSynced ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Synced to {enabledPlatformCount} Platforms!</span>
              </>
            ) : (
              <>
                <ArrowDownToLine className="w-3.5 h-3.5 text-indigo-200" />
                <span>Sync Master Caption to All</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
