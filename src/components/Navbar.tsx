import React from 'react';
import { PlatformAccount, PlatformId } from '../types';
import { Check, Sparkles, Layers, RefreshCw } from 'lucide-react';

interface NavbarProps {
  accounts: PlatformAccount[];
  onToggleAccount: (id: PlatformId) => void;
  onResetAll: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  accounts,
  onToggleAccount,
  onResetAll,
}) => {
  const getPlatformIcon = (id: PlatformId) => {
    switch (id) {
      case 'youtube':
        return (
          <div className="w-4 h-4 rounded bg-red-600 flex items-center justify-center text-[10px] font-black text-white">
            ▶
          </div>
        );
      case 'instagram':
        return (
          <div className="w-4 h-4 rounded bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
            ◎
          </div>
        );
      case 'tiktok':
        return (
          <div className="w-4 h-4 rounded bg-black border border-cyan-400/80 flex items-center justify-center text-[10px] font-black text-cyan-300">
            ♪
          </div>
        );
      case 'facebook':
        return (
          <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center text-[11px] font-black text-white">
            f
          </div>
        );
    }
  };

  const getPlatformLabel = (id: PlatformId) => {
    switch (id) {
      case 'youtube':
        return 'YouTube Shorts';
      case 'instagram':
        return 'Instagram Reels';
      case 'tiktok':
        return 'TikTok';
      case 'facebook':
        return 'Facebook Reels';
    }
  };

  const connectedCount = accounts.filter((a) => a.connected).length;

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* App Title & Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                OmniPost <span className="text-indigo-400 font-extrabold">Studio</span>
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Shorts 9:16
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              One-click short-form video cross-posting dashboard
            </p>
          </div>
        </div>

        {/* Right Status Bar: Connected Accounts */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 mr-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              <strong className="text-slate-200">{connectedCount}/4</strong> Connected
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
            {accounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => onToggleAccount(acc.id)}
                title={`Click to toggle ${acc.name} (${acc.connected ? 'Connected' : 'Disconnected'})`}
                className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                  acc.connected
                    ? 'bg-slate-800/90 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600 shadow-sm'
                    : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border-dashed border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                }`}
              >
                {getPlatformIcon(acc.id)}
                <span className="hidden md:inline">{getPlatformLabel(acc.id)}</span>
                <span className="md:hidden capitalize">{acc.id}</span>

                {/* Status Dot */}
                <span
                  className={`inline-block w-2 h-2 rounded-full transition-colors ${
                    acc.connected ? 'bg-emerald-400 ring-2 ring-emerald-500/20' : 'bg-slate-600'
                  }`}
                />

                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono transition-colors ${
                    acc.connected
                      ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                      : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {acc.connected ? 'Connected' : 'Connect'}
                </span>
              </button>
            ))}

            <button
              onClick={onResetAll}
              title="Reset dashboard state"
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors ml-1"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
