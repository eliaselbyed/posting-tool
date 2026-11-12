import React, { useState } from 'react';
import { PlatformId, VideoMetadata, ScheduleConfig } from '../types';
import {
  Send,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ChevronUp,
  X,
} from 'lucide-react';

interface BottomActionBarProps {
  video: VideoMetadata | null;
  selectedPlatforms: Record<PlatformId, boolean>;
  onPublish: () => void;
  isPublishing: boolean;
  scheduleConfig: ScheduleConfig;
  onUpdateSchedule: (config: ScheduleConfig) => void;
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  video,
  selectedPlatforms,
  onPublish,
  isPublishing,
  scheduleConfig,
  onUpdateSchedule,
}) => {
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);

  const activePlatforms = (Object.keys(selectedPlatforms) as PlatformId[]).filter(
    (key) => selectedPlatforms[key]
  );
  const activeCount = activePlatforms.length;
  const isReady = !!video && activeCount > 0;

  const getReasonDisabled = (): string | null => {
    if (!video && activeCount === 0) {
      return 'Please upload a 9:16 video and select at least 1 platform';
    }
    if (!video) {
      return 'Please upload a video or select a demo sample to publish';
    }
    if (activeCount === 0) {
      return 'Please toggle on at least one publishing platform';
    }
    return null;
  };

  const disabledReason = getReasonDisabled();

  // Presets for peak posting times
  const applyPresetTime = (hoursFromNow: number) => {
    const target = new Date(Date.now() + hoursFromNow * 3600 * 1000);
    // Round to nearest 15 mins
    const minutes = Math.ceil(target.getMinutes() / 15) * 15;
    target.setMinutes(minutes);
    target.setSeconds(0);
    target.setMilliseconds(0);

    const isoString = new Date(target.getTime() - target.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    onUpdateSchedule({
      isScheduled: true,
      scheduledAt: isoString,
    });
    setShowSchedulePicker(false);
  };

  return (
    <div className="sticky bottom-0 z-20 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 shadow-2xl py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Status: Video and Platforms Summary */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          {video ? (
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-semibold truncate max-w-[140px] sm:max-w-[200px]">
                {video.name}
              </span>
              <span className="text-slate-500 font-mono">({video.formattedDuration})</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>No video selected</span>
            </div>
          )}

          {/* Active Platforms Badges */}
          <div className="flex items-center gap-1">
            {activePlatforms.map((p) => {
              const bg =
                p === 'youtube'
                  ? 'bg-red-500/10 text-red-400 border-red-500/30'
                  : p === 'instagram'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : p === 'tiktok'
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/30';
              return (
                <span
                  key={p}
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${bg}`}
                >
                  {p}
                </span>
              );
            })}
            {activeCount === 0 && (
              <span className="text-xs text-slate-500 italic">0 selected</span>
            )}
          </div>
        </div>

        {/* Right Actions: Schedule Toggle & Publish Button */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Schedule Picker Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSchedulePicker(!showSchedulePicker)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                scheduleConfig.isScheduled
                  ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/50 shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {scheduleConfig.isScheduled && scheduleConfig.scheduledAt
                  ? `Scheduled (${new Date(scheduleConfig.scheduledAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })})`
                  : 'Schedule Post'}
              </span>
              <ChevronUp
                className={`w-3.5 h-3.5 transition-transform ${
                  showSchedulePicker ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Schedule Popover Card */}
            {showSchedulePicker && (
              <div className="absolute right-0 bottom-full mb-3 w-72 sm:w-80 bg-slate-900 border border-slate-700/80 rounded-2xl p-4 shadow-2xl z-30 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span>Schedule Release Time</span>
                  </div>
                  <button
                    onClick={() => setShowSchedulePicker(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Enable Scheduling</span>
                  <input
                    type="checkbox"
                    checked={scheduleConfig.isScheduled}
                    onChange={(e) =>
                      onUpdateSchedule({
                        ...scheduleConfig,
                        isScheduled: e.target.checked,
                        scheduledAt:
                          scheduleConfig.scheduledAt ||
                          new Date(Date.now() + 4 * 3600 * 1000).toISOString().slice(0, 16),
                      })
                    }
                    className="rounded bg-slate-800 border-slate-700 text-indigo-600"
                  />
                </div>

                {scheduleConfig.isScheduled && (
                  <div className="space-y-2">
                    <label className="text-[11px] text-slate-400 block">
                      Choose date & time:
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduleConfig.scheduledAt || ''}
                      onChange={(e) =>
                        onUpdateSchedule({
                          ...scheduleConfig,
                          scheduledAt: e.target.value,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        Quick Peak Engagement Presets:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => applyPresetTime(3)}
                          className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium text-left"
                        >
                          Today in 3 hrs (Evening)
                        </button>
                        <button
                          type="button"
                          onClick={() => applyPresetTime(18)}
                          className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium text-left"
                        >
                          Tomorrow Noon (Lunch)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateSchedule({ isScheduled: false, scheduledAt: undefined });
                      setShowSchedulePicker(false);
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300"
                  >
                    Post Immediately
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSchedulePicker(false)}
                    className="text-xs px-3 py-1 rounded-lg bg-indigo-600 text-white font-medium"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="relative group">
            <button
              type="button"
              disabled={!isReady || isPublishing}
              onClick={onPublish}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-xl ${
                isReady && !isPublishing
                  ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white shadow-indigo-500/25 active:scale-95 cursor-pointer ring-1 ring-white/20'
                  : 'bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed'
              }`}
            >
              {isPublishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing Cross-Feed...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-cyan-300" />
                  <span>
                    {scheduleConfig.isScheduled
                      ? `Schedule to ${activeCount} Platform${activeCount === 1 ? '' : 's'}`
                      : `Publish to ${activeCount} Platform${activeCount === 1 ? '' : 's'}`}
                  </span>
                </>
              )}
            </button>

            {/* Hover Tooltip when disabled */}
            {!isReady && disabledReason && (
              <div className="absolute right-0 bottom-full mb-2 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 whitespace-nowrap shadow-xl z-30">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{disabledReason}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
