import React, { useRef, useState } from 'react';
import { VideoMetadata } from '../types';
import { SAMPLE_VIDEOS } from '../services/publishService';
import { Upload, Film, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface VideoUploaderProps {
  onVideoSelected: (metadata: VideoMetadata) => void;
  currentVideo: VideoMetadata | null;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  onVideoSelected,
  currentVideo,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const processVideoFile = (file: File) => {
    setError(null);
    setIsLoadingFile(true);

    const validExtensions = ['.mp4', '.mov'];
    const hasValidExt = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );

    if (!hasValidExt && !file.type.includes('mp4') && !file.type.includes('quicktime')) {
      setError('Please upload a valid .mp4 or .mov video file.');
      setIsLoadingFile(false);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = objectUrl;

    video.onloadedmetadata = () => {
      const duration = video.duration || 0;
      const width = video.videoWidth || 1080;
      const height = video.videoHeight || 1920;
      const isVertical = height > width;

      const metadata: VideoMetadata = {
        name: file.name,
        sizeBytes: file.size,
        formattedSize: formatFileSize(file.size),
        durationSeconds: Math.round(duration),
        formattedDuration: formatDuration(duration),
        width,
        height,
        aspectRatio: isVertical ? '9:16 (Vertical)' : `${width}:${height}`,
        fileUrl: objectUrl,
        file,
        isSample: false,
      };

      setIsLoadingFile(false);
      onVideoSelected(metadata);
    };

    video.onerror = () => {
      setError('Failed to parse video metadata. Please try another file.');
      setIsLoadingFile(false);
    };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processVideoFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processVideoFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="video/mp4,video/quicktime,.mp4,.mov"
        className="hidden"
      />

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-6 transition-all duration-200 text-center ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99]'
            : 'border-slate-800 hover:border-indigo-500/60 bg-slate-900/60 hover:bg-slate-900/90'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-200">
            {isLoadingFile ? (
              <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-200">
              Drag & drop your 9:16 vertical video here
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports <strong className="text-slate-300">.mp4</strong> and{' '}
              <strong className="text-slate-300">.mov</strong> (Shorts, Reels, TikTok)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-indigo-400 font-medium border border-slate-700/80 group-hover:border-indigo-500/40 transition-colors">
              Browse Local Files
            </span>
            <span className="text-slate-400">or try demo clips below</span>
          </div>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Built-in Sample Videos for One-Click Demo Testing */}
      <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Quick Demo Clips (No file required)
          </span>
          <span className="text-[10px] text-slate-400">9:16 Vertical HD</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {SAMPLE_VIDEOS.map((sample, idx) => {
            const isSelected = currentVideo?.name === sample.name;
            return (
              <button
                key={sample.name}
                type="button"
                onClick={() => {
                  setError(null);
                  onVideoSelected(sample);
                }}
                className={`relative flex flex-col items-start p-2 rounded-lg text-left transition-all border ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500/80 ring-1 ring-indigo-500/40'
                    : 'bg-slate-900 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[10px] font-bold text-slate-400">
                    Sample {idx + 1}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  )}
                </div>
                <span className="text-xs font-medium text-slate-200 truncate w-full">
                  {idx === 0
                    ? 'Cyberpunk City'
                    : idx === 1
                    ? 'Barista Latte'
                    : 'Fitness Gym'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
                  {sample.formattedDuration} • {sample.formattedSize}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
