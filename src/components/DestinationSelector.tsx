import React from 'react';
import { PlatformAccount, PlatformId } from '../types';
import { Check, AlertTriangle, Radio } from 'lucide-react';

interface DestinationSelectorProps {
  selectedPlatforms: Record<PlatformId, boolean>;
  onTogglePlatform: (id: PlatformId) => void;
  accounts: PlatformAccount[];
  onConnectAccount: (id: PlatformId) => void;
}

export const DestinationSelector: React.FC<DestinationSelectorProps> = ({
  selectedPlatforms,
  onTogglePlatform,
  accounts,
  onConnectAccount,
}) => {
  const platforms: {
    id: PlatformId;
    name: string;
    badge: string;
    color: string;
    glow: string;
    bgHover: string;
    icon: React.ReactNode;
    reach: string;
  }[] = [
    {
      id: 'youtube',
      name: 'YouTube Shorts',
      badge: 'Shorts 60s',
      color: 'border-red-500/50 text-red-400 bg-red-500/10',
      glow: 'shadow-red-500/10',
      bgHover: 'hover:border-red-500/40',
      reach: '48.2K subs',
      icon: (
        <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-red-600/30">
          ▶
        </div>
      ),
    },
    {
      id: 'instagram',
      name: 'Instagram Reels',
      badge: 'Reels 90s',
      color: 'border-rose-500/50 text-rose-400 bg-rose-500/10',
      glow: 'shadow-rose-500/10',
      bgHover: 'hover:border-rose-500/40',
      reach: '82.5K reach',
      icon: (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-rose-600/30">
          ◎
        </div>
      ),
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      badge: 'FYP Trend',
      color: 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10',
      glow: 'shadow-cyan-500/10',
      bgHover: 'hover:border-cyan-500/40',
      reach: '194K audience',
      icon: (
        <div className="w-8 h-8 rounded-xl bg-black border border-cyan-400 flex items-center justify-center text-cyan-300 font-black text-sm shadow-md shadow-cyan-500/20">
          ♪
        </div>
      ),
    },
    {
      id: 'facebook',
      name: 'Facebook Reels',
      badge: 'FB Reels',
      color: 'border-blue-500/50 text-blue-400 bg-blue-500/10',
      glow: 'shadow-blue-500/10',
      bgHover: 'hover:border-blue-500/40',
      reach: '12.4K audience',
      icon: (
        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-600/30">
          f
        </div>
      ),
    },
  ];

  const selectedCount = Object.values(selectedPlatforms).filter(Boolean).length;

  return (
    <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>Publishing Destinations</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {selectedCount} of 4 selected
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Select the platforms that will receive this video
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const allSelected = selectedCount === 4;
            platforms.forEach((p) => {
              if (allSelected && selectedPlatforms[p.id]) {
                onTogglePlatform(p.id);
              } else if (!allSelected && !selectedPlatforms[p.id]) {
                onTogglePlatform(p.id);
              }
            });
          }}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          {selectedCount === 4 ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms[platform.id];
          const account = accounts.find((a) => a.id === platform.id);
          const isConnected = account?.connected;

          return (
            <div
              key={platform.id}
              onClick={() => onTogglePlatform(platform.id)}
              className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? `bg-slate-850 border-slate-700 shadow-lg ${platform.glow} ring-1 ring-white/10`
                  : `bg-slate-950/60 border-slate-800/80 ${platform.bgHover} opacity-70 hover:opacity-100`
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  {platform.icon}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-100">
                        {platform.name}
                      </h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {platform.badge}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <span>{account?.handle || `@${platform.id}`}</span>
                      <span>•</span>
                      <span className="text-slate-500 font-mono">{platform.reach}</span>
                    </p>
                  </div>
                </div>

                {/* Custom Toggle Switch */}
                <div
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    isSelected ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isSelected ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Status Warning if selected but not connected */}
              {isSelected && !isConnected && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onConnectAccount(platform.id);
                  }}
                  className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-amber-400 bg-amber-500/5 px-2 py-1 rounded-lg"
                >
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Account not connected
                  </span>
                  <span className="underline font-semibold hover:text-amber-300">
                    Connect now
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
