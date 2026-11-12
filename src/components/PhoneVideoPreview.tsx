import React, { useRef, useState, useEffect } from 'react';
import { VideoMetadata } from '../types';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  Film,
  HardDrive,
  Clock,
  Maximize2,
  Heart,
  MessageCircle,
  Share2,
  Disc3,
} from 'lucide-react';

interface PhoneVideoPreviewProps {
  video: VideoMetadata;
  onRemoveVideo: () => void;
  onReplaceVideo: () => void;
}

export const PhoneVideoPreview: React.FC<PhoneVideoPreviewProps> = ({
  video,
  onRemoveVideo,
  onReplaceVideo,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.durationSeconds || 0);
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [isLooping, setIsLooping] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false);
      });
    }
  }, [video.fileUrl]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Phone Mockup Frame */}
      <div className="relative w-full max-w-[280px] sm:max-w-[300px] aspect-[9/19] rounded-[44px] p-3 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-2xl shadow-indigo-500/10 border-4 border-slate-700/80 ring-1 ring-slate-600/40">
        {/* Dynamic Island / Speaker Pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-24 h-5 rounded-full bg-black flex items-center justify-end px-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 ring-1 ring-indigo-500/30" />
        </div>

        {/* Video Screen Area */}
        <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={video.fileUrl}
            loop={isLooping}
            muted={isMuted}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => {
              if (!isLooping) setIsPlaying(false);
            }}
            onClick={togglePlay}
            className="w-full h-full object-cover cursor-pointer"
          />

          {/* Social Platform Safe Zones Overlay (Simulated UI guide) */}
          {showSafeZones && (
            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4">
              {/* Top safe margin */}
              <div className="h-14 border-b border-dashed border-amber-400/50 flex items-start justify-center pt-2">
                <span className="text-[9px] font-mono uppercase bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded backdrop-blur-sm">
                  Top Header / Following-FYP Margin
                </span>
              </div>

              {/* Right Side Social Actions (Like, Comment, Bookmark, Share, Sound) */}
              <div className="absolute right-2.5 bottom-20 flex flex-col items-center gap-3">
                <div className="flex flex-col items-center gap-0.5 opacity-80">
                  <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[8px] text-white/80 font-mono">24.5k</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 opacity-80">
                  <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[8px] text-white/80 font-mono">1.2k</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 opacity-80">
                  <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Share2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[8px] text-white/80 font-mono">Share</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-black/50 border border-amber-400/80 animate-spin flex items-center justify-center">
                  <Disc3 className="w-4 h-4 text-amber-300" />
                </div>
              </div>

              {/* Bottom Caption Safe Zone */}
              <div className="h-24 border-t border-dashed border-amber-400/50 flex flex-col justify-end p-2 bg-gradient-to-t from-black/60 to-transparent">
                <span className="text-[9px] font-mono text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded w-max">
                  Bottom Feed Caption Safe Zone
                </span>
                <p className="text-[10px] text-white/70 line-clamp-2 mt-1">
                  @omnistudio • Master short-form video preview title...
                </p>
              </div>
            </div>
          )}

          {/* Quick Play/Pause Center Indicator on Hover/Pause */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                <Play className="w-6 h-6 text-white fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Bottom On-Screen Playback Controls */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-col gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-2 rounded-xl border border-white/10">
            {/* Scrubber slider */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-400"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="hover:text-white transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="hover:text-white transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </button>
                <span className="font-mono text-[10px] text-slate-400">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsLooping(!isLooping)}
                  title={isLooping ? 'Looping enabled' : 'Looping disabled'}
                  className={`p-1 rounded transition-colors ${
                    isLooping ? 'text-indigo-400 bg-indigo-500/20' : 'text-slate-500'
                  }`}
                >
                  <RotateCcw className="w-3 h-3" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowSafeZones(!showSafeZones)}
                  title="Toggle TikTok & Reels UI Safe Zones"
                  className={`p-1 rounded transition-colors ${
                    showSafeZones ? 'text-amber-400 bg-amber-500/20' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {showSafeZones ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Home indicator bar */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full bg-slate-500/50" />
      </div>

      {/* Metadata & Actions Bar */}
      <div className="w-full mt-4 bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-slate-200 truncate flex items-center gap-1.5">
              <Film className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="truncate">{video.name}</span>
            </h4>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 flex-wrap">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {video.formattedSize}
              </span>
              <span>•</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {video.formattedDuration}
              </span>
              <span>•</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
                {video.width}×{video.height} (9:16)
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Replace & Remove */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onReplaceVideo}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            Replace Video
          </button>
          <button
            type="button"
            onClick={onRemoveVideo}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium transition-colors border border-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove Video
          </button>
        </div>
      </div>
    </div>
  );
};
