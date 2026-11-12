import React, { useState, useRef } from 'react';
import {
  PlatformAccount,
  PlatformConfig,
  PlatformId,
  PublishResult,
  PublishStep,
  ScheduleConfig,
  VideoMetadata,
  VideoPayload,
} from './types';
import {
  generateAICaptions,
  INITIAL_ACCOUNTS,
  publishToPlatforms,
  SAMPLE_VIDEOS,
} from './services/publishService';
import { Navbar } from './components/Navbar';
import { VideoUploader } from './components/VideoUploader';
import { PhoneVideoPreview } from './components/PhoneVideoPreview';
import { MasterTopicSection } from './components/MasterTopicSection';
import { DestinationSelector } from './components/DestinationSelector';
import { PlatformMetadataTabs } from './components/PlatformMetadataTabs';
import { BottomActionBar } from './components/BottomActionBar';
import { PublishModal } from './components/PublishModal';
import { Sparkles, Layers, CheckCircle2, Video } from 'lucide-react';

const INITIAL_PLATFORM_CONFIGS: PlatformConfig = {
  youtube: {
    title: '3 Secret AI Tools You Need In 2026 #Shorts',
    description: `🔥 3 Secret AI Tools That Save 10 Hours Every Week!

If you found this valuable, don't forget to like and subscribe for daily creator breakdowns!

⏱️ Timestamps:
0:00 - The Big Problem
0:06 - The Solution
0:12 - How To Apply Today

#shorts #creators #productivity #tech #trending`,
    visibility: 'public',
    tags: ['shorts', 'creatoreconomy', 'productivity', 'techtips', 'ai', 'howto'],
    category: 'Science & Technology',
    madeForKids: false,
  },
  instagram: {
    caption: `Save this for later! 📌 

Here is what most creators don't realize about building high-converting short-form content in 2026:

1️⃣ It's 10x easier once you set up the initial framework
2️⃣ Small daily iterations beat random bursts of motivation
3️⃣ Don't overcomplicate your tech stack

Drop a '🔥' in the comments if you want the complete step-by-step PDF checklist sent directly to your DMs!

—
#reels #reelsinstagram #contentcreator #creators #videomarketing #tipsandtricks`,
    shareToFeed: true,
    allowAudioRemix: true,
    locationTag: '',
  },
  tiktok: {
    caption: `Wait till the end… 🤯 3 secret AI tools that actually save time! Would you try this or stick to the old way? Tell me in the comments 👇 #fyp #foryou #trending #lifehack #learnontiktok #techtok`,
    privacy: 'public',
    allowComments: true,
    allowDuet: true,
    allowStitch: true,
    commercialContent: false,
  },
  facebook: {
    description: `Thinking about boosting your productivity? Here is the exact strategy we used to get results fast. 

Let us know in the comments: What is your #1 roadblock right now? 

#Reels #CreatorTips #MustWatch`,
    audience: 'public',
    allowRemixing: true,
  },
};

export default function App() {
  // Accounts state (toggleable connected status)
  const [accounts, setAccounts] = useState<PlatformAccount[]>(INITIAL_ACCOUNTS);

  // Video state (defaulted to first sample for instant delight)
  const [currentVideo, setCurrentVideo] = useState<VideoMetadata | null>(SAMPLE_VIDEOS[0]);

  // Hidden file input ref for replace action
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Master Topic & Caption state
  const [masterTopic, setMasterTopic] = useState('3 secret AI tools that save 10 hours a week');
  const [masterCaption, setMasterCaption] = useState(
    '🔥 Stop scrolling! Here are 3 game-changing AI tools that will save you 10 hours this week. Drop your thoughts below and share with a friend who needs this.'
  );
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Selected Destinations state
  const [selectedPlatforms, setSelectedPlatforms] = useState<Record<PlatformId, boolean>>({
    youtube: true,
    instagram: true,
    tiktok: true,
    facebook: false,
  });

  // Platform specific configs
  const [platformConfigs, setPlatformConfigs] = useState<PlatformConfig>(INITIAL_PLATFORM_CONFIGS);

  // Scheduling state
  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig>({
    isScheduled: false,
    scheduledAt: undefined,
  });

  // Publishing Pipeline & Modal state
  const [isPublishing, setIsPublishing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publishSteps, setPublishSteps] = useState<PublishStep[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [publishResult, setPublishResult] = useState<PublishResult | null>(null);

  // Toast / notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle Account Connection status
  const handleToggleAccount = (id: PlatformId) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === id) {
          const newStatus = !acc.connected;
          showToast(
            `${acc.name} ${newStatus ? 'connected' : 'disconnected'}`
          );
          return { ...acc, connected: newStatus };
        }
        return acc;
      })
    );
  };

  // Toggle Destination Platform selection
  const handleTogglePlatform = (id: PlatformId) => {
    setSelectedPlatforms((prev) => {
      const next = !prev[id];
      return { ...prev, [id]: next };
    });
  };

  // Update specific platform config
  const handleUpdateConfig = <K extends keyof PlatformConfig>(
    platform: K,
    updater: (prev: PlatformConfig[K]) => PlatformConfig[K]
  ) => {
    setPlatformConfigs((prev) => ({
      ...prev,
      [platform]: updater(prev[platform]),
    }));
  };

  // Sync Master Caption to all active platforms
  const handleSyncMasterToAll = () => {
    if (!masterCaption.trim()) return;

    setPlatformConfigs((prev) => ({
      ...prev,
      youtube: {
        ...prev.youtube,
        description: masterCaption,
      },
      instagram: {
        ...prev.instagram,
        caption: masterCaption,
      },
      tiktok: {
        ...prev.tiktok,
        caption: masterCaption,
      },
      facebook: {
        ...prev.facebook,
        description: masterCaption,
      },
    }));

    const activeCount = Object.values(selectedPlatforms).filter(Boolean).length;
    showToast(`Master caption synced across ${activeCount} active platform${activeCount === 1 ? '' : 's'}!`);
  };

  // AI Caption Generation
  const handleGenerateAICaptions = async () => {
    try {
      setIsGeneratingAI(true);
      const res = await generateAICaptions(masterTopic, currentVideo || undefined);

      setMasterCaption(res.masterCaption);
      setPlatformConfigs((prev) => ({
        ...prev,
        youtube: {
          ...prev.youtube,
          title: res.platforms.youtube.title,
          description: res.platforms.youtube.description,
          tags: res.platforms.youtube.tags,
        },
        instagram: {
          ...prev.instagram,
          caption: res.platforms.instagram.caption,
        },
        tiktok: {
          ...prev.tiktok,
          caption: res.platforms.tiktok.caption,
        },
        facebook: {
          ...prev.facebook,
          description: res.platforms.facebook.description,
        },
      }));

      showToast('AI-tailored captions generated for all platforms!');
    } catch {
      showToast('Failed to generate captions. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Video Replace Trigger
  const handleReplaceVideo = () => {
    replaceFileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      const videoEl = document.createElement('video');
      videoEl.preload = 'metadata';
      videoEl.src = objectUrl;

      videoEl.onloadedmetadata = () => {
        const duration = videoEl.duration || 0;
        const width = videoEl.videoWidth || 1080;
        const height = videoEl.videoHeight || 1920;
        const isVertical = height > width;

        const formatSize = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        const formatDuration = (secs: number) => {
          const m = Math.floor(secs / 60);
          const s = Math.floor(secs % 60);
          return `${m}:${s.toString().padStart(2, '0')}`;
        };

        const metadata: VideoMetadata = {
          name: file.name,
          sizeBytes: file.size,
          formattedSize: formatSize(file.size),
          durationSeconds: Math.round(duration),
          formattedDuration: formatDuration(duration),
          width,
          height,
          aspectRatio: isVertical ? '9:16 (Vertical)' : `${width}:${height}`,
          fileUrl: objectUrl,
          file,
          isSample: false,
        };

        setCurrentVideo(metadata);
        showToast(`Loaded ${file.name}`);
      };
    }
  };

  // Execute Publishing Pipeline
  const handlePublish = async () => {
    if (!currentVideo) return;

    const payload: VideoPayload = {
      video: currentVideo,
      masterTopic,
      masterCaption,
      platforms: platformConfigs,
      selectedPlatforms,
      schedule: scheduleConfig,
    };

    setIsPublishing(true);
    setIsModalOpen(true);
    setOverallProgress(0);
    setPublishResult(null);
    setPublishSteps([]);

    try {
      const result = await publishToPlatforms(payload, (step, overall) => {
        setPublishSteps((prev) => {
          const existingIndex = prev.findIndex((s) => s.id === step.id);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = step;
            return updated;
          }
          return [...prev, step];
        });
        setOverallProgress(overall);
      });

      setPublishResult(result);
      setOverallProgress(100);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Publishing failed';
      showToast(errorMsg);
    } finally {
      setIsPublishing(false);
    }
  };

  // Reset after successful publish
  const handleResetForNewPost = () => {
    setIsModalOpen(false);
    setPublishResult(null);
    setPublishSteps([]);
    setOverallProgress(0);
    setCurrentVideo(SAMPLE_VIDEOS[1]); // switch to next sample video
    setMasterTopic('5 morning habits that increased my focus by 300%');
    setMasterCaption('5 simple micro-habits that completely changed my productivity. Try #3 tomorrow!');
    showToast('Ready for your next short-form release!');
  };

  // Reset all to defaults
  const handleResetAll = () => {
    setCurrentVideo(SAMPLE_VIDEOS[0]);
    setMasterTopic('3 secret AI tools that save 10 hours a week');
    setMasterCaption(
      '🔥 Stop scrolling! Here are 3 game-changing AI tools that will save you 10 hours this week.'
    );
    setPlatformConfigs(INITIAL_PLATFORM_CONFIGS);
    setSelectedPlatforms({
      youtube: true,
      instagram: true,
      tiktok: true,
      facebook: false,
    });
    setScheduleConfig({ isScheduled: false });
    showToast('Dashboard reset to defaults');
  };

  const enabledPlatformCount = Object.values(selectedPlatforms).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Hidden File Input for Replace Action */}
      <input
        type="file"
        ref={replaceFileInputRef}
        onChange={handleFileInputChange}
        accept="video/mp4,video/quicktime,.mp4,.mov"
        className="hidden"
      />

      {/* Top Navigation Bar */}
      <Navbar
        accounts={accounts}
        onToggleAccount={handleToggleAccount}
        onResetAll={handleResetAll}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-indigo-500/50 text-white text-xs font-semibold shadow-2xl shadow-indigo-500/20 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner Quick Tips */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900/60 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">
                Short-Form 9:16 Cross-Posting Hub
              </p>
              <p className="text-[11px] text-slate-400">
                Write once, auto-optimize per platform algorithm, and publish to YouTube Shorts, Instagram Reels, TikTok & FB Reels simultaneously.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Active Destinations:</span>
            <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              {enabledPlatformCount} of 4
            </span>
          </div>
        </div>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Video Upload, Phone Preview & Master Topic */}
          <div className="lg:col-span-5 space-y-6">
            {/* If video is selected: show vertical phone preview, else show drag & drop */}
            {currentVideo ? (
              <PhoneVideoPreview
                video={currentVideo}
                onRemoveVideo={() => {
                  setCurrentVideo(null);
                  showToast('Video removed');
                }}
                onReplaceVideo={handleReplaceVideo}
              />
            ) : (
              <VideoUploader
                onVideoSelected={(video) => {
                  setCurrentVideo(video);
                  showToast(`Selected ${video.name}`);
                }}
                currentVideo={currentVideo}
              />
            )}

            {/* Master Topic, AI Generator & Master Caption */}
            <MasterTopicSection
              masterTopic={masterTopic}
              onMasterTopicChange={setMasterTopic}
              masterCaption={masterCaption}
              onMasterCaptionChange={setMasterCaption}
              onGenerateAI={handleGenerateAICaptions}
              isGeneratingAI={isGeneratingAI}
              onSyncMasterToAll={handleSyncMasterToAll}
              enabledPlatformCount={enabledPlatformCount}
            />
          </div>

          {/* Right Column: Multi-Platform Publishing Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Destination Selector: 4 toggle cards */}
            <DestinationSelector
              selectedPlatforms={selectedPlatforms}
              onTogglePlatform={handleTogglePlatform}
              accounts={accounts}
              onConnectAccount={handleToggleAccount}
            />

            {/* Platform-Specific Metadata Tabs / Customization */}
            <PlatformMetadataTabs
              platformConfigs={platformConfigs}
              onUpdateConfig={handleUpdateConfig}
              selectedPlatforms={selectedPlatforms}
              masterCaption={masterCaption}
              onSyncMasterToAll={handleSyncMasterToAll}
            />
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <BottomActionBar
        video={currentVideo}
        selectedPlatforms={selectedPlatforms}
        onPublish={handlePublish}
        isPublishing={isPublishing}
        scheduleConfig={scheduleConfig}
        onUpdateSchedule={setScheduleConfig}
      />

      {/* Publishing Progress Modal */}
      <PublishModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isPublishing={isPublishing}
        steps={publishSteps}
        overallProgress={overallProgress}
        result={publishResult}
        selectedPlatforms={selectedPlatforms}
        onResetForNewPost={handleResetForNewPost}
      />
    </div>
  );
}
