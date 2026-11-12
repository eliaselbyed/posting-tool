import React, { useState, useEffect } from 'react';
import { PlatformConfig, PlatformId, YouTubeConfig, InstagramConfig, TikTokConfig, FacebookConfig } from '../types';
import {
  Layers,
  ArrowDownToLine,
  Hash,
  X,
  Plus,
  Eye,
  Globe,
  Lock,
  Users,
  MessageSquare,
  Share2,
  Check,
  Shield,
  Tag,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface PlatformMetadataTabsProps {
  platformConfigs: PlatformConfig;
  onUpdateConfig: <K extends keyof PlatformConfig>(
    platform: K,
    updater: (prev: PlatformConfig[K]) => PlatformConfig[K]
  ) => void;
  selectedPlatforms: Record<PlatformId, boolean>;
  masterCaption: string;
  onSyncMasterToAll: () => void;
}

export const PlatformMetadataTabs: React.FC<PlatformMetadataTabsProps> = ({
  platformConfigs,
  onUpdateConfig,
  selectedPlatforms,
  masterCaption,
  onSyncMasterToAll,
}) => {
  const activePlatforms = (Object.keys(selectedPlatforms) as PlatformId[]).filter(
    (key) => selectedPlatforms[key]
  );

  const [activeTab, setActiveTab] = useState<PlatformId>('youtube');
  const [tagInput, setTagInput] = useState('');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Sync active tab to first enabled platform if current active is disabled
  useEffect(() => {
    if (activePlatforms.length > 0 && !selectedPlatforms[activeTab]) {
      setActiveTab(activePlatforms[0]);
    }
  }, [selectedPlatforms, activeTab, activePlatforms]);

  const showFeedback = (msg: string) => {
    setCopiedNotification(msg);
    setTimeout(() => setCopiedNotification(null), 2000);
  };

  const syncMasterToSinglePlatform = (platform: PlatformId) => {
    if (!masterCaption.trim()) return;

    if (platform === 'youtube') {
      onUpdateConfig('youtube', (prev) => ({
        ...prev,
        description: masterCaption,
      }));
    } else if (platform === 'instagram') {
      onUpdateConfig('instagram', (prev) => ({
        ...prev,
        caption: masterCaption,
      }));
    } else if (platform === 'tiktok') {
      onUpdateConfig('tiktok', (prev) => ({
        ...prev,
        caption: masterCaption,
      }));
    } else if (platform === 'facebook') {
      onUpdateConfig('facebook', (prev) => ({
        ...prev,
        description: masterCaption,
      }));
    }
    showFeedback(`Pasted master caption to ${platform}!`);
  };

  // Tag management for YouTube Shorts
  const handleAddTag = (tagToAdd?: string) => {
    const rawTag = (tagToAdd !== undefined ? tagToAdd : tagInput).trim();
    if (!rawTag) return;
    const cleanTag = rawTag.replace(/^#/, '');
    if (!platformConfigs.youtube.tags.includes(cleanTag)) {
      onUpdateConfig('youtube', (prev) => ({
        ...prev,
        tags: [...prev.tags, cleanTag],
      }));
    }
    if (tagToAdd === undefined) setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateConfig('youtube', (prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (activePlatforms.length === 0) {
    return (
      <div className="bg-slate-900/60 rounded-2xl p-8 border border-slate-800 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
          <Layers className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-200">
          No Destination Platforms Selected
        </h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Toggle on at least one publishing destination in the section above to customize its title, caption, hashtags, and privacy settings.
        </p>
      </div>
    );
  }

  const getPlatformHeaderStyle = (id: PlatformId) => {
    switch (id) {
      case 'youtube':
        return {
          color: 'text-red-400',
          accent: 'bg-red-600',
          label: 'YouTube Shorts',
          indicator: '▶',
        };
      case 'instagram':
        return {
          color: 'text-rose-400',
          accent: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600',
          label: 'Instagram Reels',
          indicator: '◎',
        };
      case 'tiktok':
        return {
          color: 'text-cyan-400',
          accent: 'bg-black border border-cyan-400 text-cyan-300',
          label: 'TikTok',
          indicator: '♪',
        };
      case 'facebook':
        return {
          color: 'text-blue-400',
          accent: 'bg-blue-600',
          label: 'Facebook Reels',
          indicator: 'f',
        };
    }
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden space-y-0">
      {/* Platform Tabs Header Bar */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>Platform-Specific Metadata</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {activePlatforms.length} Active
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Tailor title, character counts, and algorithmic settings per network
          </p>
        </div>

        {/* Global Sync Button */}
        <button
          type="button"
          onClick={onSyncMasterToAll}
          disabled={!masterCaption.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition-all self-start sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowDownToLine className="w-3.5 h-3.5 text-indigo-400" />
          <span>Sync Master to All Active</span>
        </button>
      </div>

      {/* Tabs Switcher for Active Platforms */}
      <div className="flex border-b border-slate-800 bg-slate-950/70 overflow-x-auto scrollbar-none">
        {activePlatforms.map((id) => {
          const style = getPlatformHeaderStyle(id);
          const isActive = activeTab === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? `border-indigo-500 bg-slate-900 text-white`
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <div
                className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-black text-white ${style.accent}`}
              >
                {style.indicator}
              </div>
              <span>{style.label}</span>
            </button>
          );
        })}
      </div>

      {/* Notification toast for inline operations */}
      {copiedNotification && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2 text-xs text-emerald-400 flex items-center gap-2">
          <Check className="w-3.5 h-3.5" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* Tab Panels */}
      <div className="p-5">
        {/* YOUTUBE SHORTS PANEL */}
        {activeTab === 'youtube' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-white text-xs font-black">
                  ▶
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">
                    YouTube Shorts Settings
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Optimized for YouTube mobile algorithm & Search
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => syncMasterToSinglePlatform('youtube')}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <ArrowDownToLine className="w-3 h-3" />
                Pull Master Caption
              </button>
            </div>

            {/* Title with max 100 character counter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200">
                  Shorts Title <span className="text-rose-400">*</span>
                </label>
                <span
                  className={`text-[11px] font-mono ${
                    platformConfigs.youtube.title.length > 90
                      ? 'text-amber-400 font-bold'
                      : platformConfigs.youtube.title.length === 100
                      ? 'text-rose-400 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  {platformConfigs.youtube.title.length}/100
                </span>
              </div>
              <input
                type="text"
                maxLength={100}
                value={platformConfigs.youtube.title}
                onChange={(e) =>
                  onUpdateConfig('youtube', (prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Catchy hook title (Include #Shorts for extra reach)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all font-medium"
              />
              <p className="text-[10px] text-slate-500">
                Pro tip: Titles under 70 characters prevent cutoff on mobile feeds.
              </p>
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Description & Links
              </label>
              <textarea
                rows={4}
                value={platformConfigs.youtube.description}
                onChange={(e) =>
                  onUpdateConfig('youtube', (prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Add timestamps, resource links, related videos, and creator bio..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all resize-y"
              />
            </div>

            {/* Visibility & Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Visibility */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  Visibility
                </label>
                <select
                  value={platformConfigs.youtube.visibility}
                  onChange={(e) =>
                    onUpdateConfig('youtube', (prev) => ({
                      ...prev,
                      visibility: e.target.value as 'public' | 'unlisted' | 'private',
                    }))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                >
                  <option value="public">Public (Instant broadcast)</option>
                  <option value="unlisted">Unlisted (Link only)</option>
                  <option value="private">Private (Only you)</option>
                </select>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  Category
                </label>
                <select
                  value={platformConfigs.youtube.category}
                  onChange={(e) =>
                    onUpdateConfig('youtube', (prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                >
                  <option value="Science & Technology">Science & Technology</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Howto & Style">Howto & Style</option>
                  <option value="Education">Education</option>
                  <option value="People & Blogs">People & Blogs</option>
                  <option value="Film & Animation">Film & Animation</option>
                </select>
              </div>
            </div>

            {/* Tags Input (Pills & Add) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  YouTube Tags ({platformConfigs.youtube.tags.length})
                </span>
                <span className="text-[10px] text-slate-500">
                  Press Enter or comma to add
                </span>
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="e.g. tech, viral, productivity..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag()}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-1.5">
                {platformConfigs.youtube.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-300 text-xs border border-red-500/20 font-mono"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-red-400 hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Made for kids check */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-300">Audience Setting (COPPA)</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                <input
                  type="checkbox"
                  checked={platformConfigs.youtube.madeForKids}
                  onChange={(e) =>
                    onUpdateConfig('youtube', (prev) => ({
                      ...prev,
                      madeForKids: e.target.checked,
                    }))
                  }
                  className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span className="text-xs">Yes, made for kids</span>
              </label>
            </div>
          </div>
        )}

        {/* INSTAGRAM REELS PANEL */}
        {activeTab === 'instagram' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  ◎
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">
                    Instagram Reels Settings
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Grid distribution, audio attribution, and hashtags
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => syncMasterToSinglePlatform('instagram')}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <ArrowDownToLine className="w-3 h-3" />
                Pull Master Caption
              </button>
            </div>

            {/* Caption & Hashtags with 2,200 char counter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200">
                  Caption & Hashtags <span className="text-rose-400">*</span>
                </label>
                <span
                  className={`text-[11px] font-mono ${
                    platformConfigs.instagram.caption.length > 2100
                      ? 'text-rose-400 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  {platformConfigs.instagram.caption.length}/2,200
                </span>
              </div>
              <textarea
                rows={5}
                maxLength={2200}
                value={platformConfigs.instagram.caption}
                onChange={(e) =>
                  onUpdateConfig('instagram', (prev) => ({
                    ...prev,
                    caption: e.target.value,
                  }))
                }
                placeholder="Write an engaging 2-line hook, line breaks, call-to-action (e.g. 'Comment EBOOK below!'), and strategic hashtag cluster..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500 transition-all resize-y"
              />
            </div>

            {/* Instagram Specific Toggles */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              {/* Share to Feed Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <h5 className="text-xs font-semibold text-slate-200">
                    Share to Profile Feed Grid
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    Also displays the Reel in your main profile grid tab
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateConfig('instagram', (prev) => ({
                      ...prev,
                      shareToFeed: !prev.shareToFeed,
                    }))
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    platformConfigs.instagram.shareToFeed
                      ? 'bg-rose-500'
                      : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      platformConfigs.instagram.shareToFeed
                        ? 'translate-x-4'
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Allow Audio Remixing Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <h5 className="text-xs font-semibold text-slate-200">
                    Allow Audio Remixing
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    Let other creators reuse your original audio track
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateConfig('instagram', (prev) => ({
                      ...prev,
                      allowAudioRemix: !prev.allowAudioRemix,
                    }))
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    platformConfigs.instagram.allowAudioRemix
                      ? 'bg-rose-500'
                      : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      platformConfigs.instagram.allowAudioRemix
                        ? 'translate-x-4'
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Location Tag */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Location Tag (Optional)
                </label>
                <input
                  type="text"
                  value={platformConfigs.instagram.locationTag}
                  onChange={(e) =>
                    onUpdateConfig('instagram', (prev) => ({
                      ...prev,
                      locationTag: e.target.value,
                    }))
                  }
                  placeholder="e.g. San Francisco, California or London, UK"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                />
              </div>
            </div>
          </div>
        )}

        {/* TIKTOK PANEL */}
        {activeTab === 'tiktok' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-black border border-cyan-400 flex items-center justify-center text-cyan-300 text-xs font-black">
                  ♪
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">
                    TikTok Settings
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    FYP optimization, Duet, Stitch, and interaction controls
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => syncMasterToSinglePlatform('tiktok')}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <ArrowDownToLine className="w-3 h-3" />
                Pull Master Caption
              </button>
            </div>

            {/* Caption & Hashtags with 2,200 char counter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200">
                  TikTok Caption & Tags <span className="text-cyan-400">*</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {platformConfigs.tiktok.caption.length}/2,200
                </span>
              </div>
              <textarea
                rows={4}
                maxLength={2200}
                value={platformConfigs.tiktok.caption}
                onChange={(e) =>
                  onUpdateConfig('tiktok', (prev) => ({
                    ...prev,
                    caption: e.target.value,
                  }))
                }
                placeholder="High-energy hook + questions to spark comment section arguments + #fyp #viral #trending..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all resize-y"
              />
            </div>

            {/* Privacy Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Who can view this video
              </label>
              <select
                value={platformConfigs.tiktok.privacy}
                onChange={(e) =>
                  onUpdateConfig('tiktok', (prev) => ({
                    ...prev,
                    privacy: e.target.value as 'public' | 'friends' | 'only_me',
                  }))
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              >
                <option value="public">Public (Everyone on FYP)</option>
                <option value="friends">Friends (Followers you follow back)</option>
                <option value="only_me">Only Me (Private review)</option>
              </select>
            </div>

            {/* Toggles: Comments, Duet, Stitch */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <label className="text-xs font-semibold text-slate-300">
                Creator Interaction Permissions
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Comments */}
                <div
                  onClick={() =>
                    onUpdateConfig('tiktok', (prev) => ({
                      ...prev,
                      allowComments: !prev.allowComments,
                    }))
                  }
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    platformConfigs.tiktok.allowComments
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">Comments</span>
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] opacity-80">
                    {platformConfigs.tiktok.allowComments ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                {/* Duet */}
                <div
                  onClick={() =>
                    onUpdateConfig('tiktok', (prev) => ({
                      ...prev,
                      allowDuet: !prev.allowDuet,
                    }))
                  }
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    platformConfigs.tiktok.allowDuet
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">Duet</span>
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] opacity-80">
                    {platformConfigs.tiktok.allowDuet ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                {/* Stitch */}
                <div
                  onClick={() =>
                    onUpdateConfig('tiktok', (prev) => ({
                      ...prev,
                      allowStitch: !prev.allowStitch,
                    }))
                  }
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    platformConfigs.tiktok.allowStitch
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">Stitch</span>
                    <Share2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] opacity-80">
                    {platformConfigs.tiktok.allowStitch ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

            {/* Commercial content disclosure */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Commercial Content / Paid Partnership disclosure
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={platformConfigs.tiktok.commercialContent}
                  onChange={(e) =>
                    onUpdateConfig('tiktok', (prev) => ({
                      ...prev,
                      commercialContent: e.target.checked,
                    }))
                  }
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span className="text-xs">Disclose brand</span>
              </label>
            </div>
          </div>
        )}

        {/* FACEBOOK REELS PANEL */}
        {activeTab === 'facebook' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-black">
                  f
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">
                    Facebook Reels Settings
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Page & Profile audience distribution
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => syncMasterToSinglePlatform('facebook')}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <ArrowDownToLine className="w-3 h-3" />
                Pull Master Caption
              </button>
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Reels Description <span className="text-blue-400">*</span>
              </label>
              <textarea
                rows={4}
                value={platformConfigs.facebook.description}
                onChange={(e) =>
                  onUpdateConfig('facebook', (prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Write a clear story or value breakdown for Facebook Reels viewers..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all resize-y"
              />
            </div>

            {/* Audience Selector & Remixing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  Audience
                </label>
                <select
                  value={platformConfigs.facebook.audience}
                  onChange={(e) =>
                    onUpdateConfig('facebook', (prev) => ({
                      ...prev,
                      audience: e.target.value as 'public' | 'friends',
                    }))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <option value="public">Public (Anyone on or off Facebook)</option>
                  <option value="friends">Friends Only</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-xs text-slate-300">Allow Remixing</span>
                  <input
                    type="checkbox"
                    checked={platformConfigs.facebook.allowRemixing}
                    onChange={(e) =>
                      onUpdateConfig('facebook', (prev) => ({
                        ...prev,
                        allowRemixing: e.target.checked,
                      }))
                    }
                    className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
