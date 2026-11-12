import {
  AICaptionResponse,
  PlatformAccount,
  PlatformConfig,
  PlatformId,
  PublishedPlatformResult,
  PublishResult,
  PublishStep,
  VideoMetadata,
  VideoPayload,
} from '../types';

/**
 * Initial Connected Accounts mock state
 */
export const INITIAL_ACCOUNTS: PlatformAccount[] = [
  {
    id: 'youtube',
    name: 'OmniStudio Shorts',
    handle: '@omnistudio.shorts',
    connected: true,
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    followers: '48.2K subs',
    verified: true,
  },
  {
    id: 'instagram',
    name: 'OmniStudio Reels',
    handle: '@omnistudio.ig',
    connected: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    followers: '82.5K followers',
    verified: true,
  },
  {
    id: 'tiktok',
    name: 'Omni Creator Lab',
    handle: '@omnistudio.tok',
    connected: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    followers: '194K followers',
    verified: false,
  },
  {
    id: 'facebook',
    name: 'OmniStudio Page',
    handle: '@omnistudiopage',
    connected: false,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    followers: '12.4K followers',
    verified: false,
  },
];

/**
 * Built-in Sample Videos for instant testing without manual file selection
 */
export const SAMPLE_VIDEOS: VideoMetadata[] = [
  {
    name: 'cyberpunk_city_loop.mp4',
    sizeBytes: 8_420_000,
    formattedSize: '8.0 MB',
    durationSeconds: 15,
    formattedDuration: '0:15',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16 (Vertical)',
    fileUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-aerial-view-of-a-city-at-night-42352-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&auto=format&fit=crop&q=80',
    isSample: true,
  },
  {
    name: 'latte_art_pour_aesthetic.mp4',
    sizeBytes: 6_150_000,
    formattedSize: '5.9 MB',
    durationSeconds: 12,
    formattedDuration: '0:12',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16 (Vertical)',
    fileUrl: 'https://assets.mixkit.co/videos/preview/mixkit-barista-making-latte-art-in-a-glass-cup-40890-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80',
    isSample: true,
  },
  {
    name: 'gym_workout_motivation.mp4',
    sizeBytes: 9_200_000,
    formattedSize: '8.8 MB',
    durationSeconds: 18,
    formattedDuration: '0:18',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16 (Vertical)',
    fileUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-exercising-in-a-crossfit-gym-42861-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    isSample: true,
  },
];

/**
 * Suggested topic ideas for quick AI generation
 */
export const SAMPLE_TOPICS = [
  '3 secret AI tools that save 10 hours a week',
  'Morning routine of a 7-figure founder',
  'How to shoot cinematic video on just an iPhone',
  'Stop making this beginner mistake in 2026',
];

/**
 * Helper to simulate network latency
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock API: AI Caption & Metadata Generation
 * Simulates high-quality, platform-optimized content generation
 */
export async function generateAICaptions(
  topic: string,
  _video?: Partial<VideoMetadata>
): Promise<AICaptionResponse> {
  // Simulate AI model latency
  await delay(1100);

  const cleanTopic = topic.trim() || 'Game-changing workflow tips for creators';

  // Smart algorithmic synthesis of platform metadata
  const ytTitle = `${cleanTopic.slice(0, 75)} (You NEED To See This!) #Shorts`.slice(0, 98);

  const ytDesc = `🔥 In this short: ${cleanTopic}
  
If you found this valuable, don't forget to like and subscribe for daily creator breakdowns!

⏱️ Timestamps:
0:00 - The Big Problem
0:06 - The Solution
0:12 - How To Apply Today

#shorts #creators #productivity #tech #trending`;

  const ytTags = [
    'shorts',
    'creatoreconomy',
    'productivity',
    'techtips',
    'digitalcreators',
    'viralvideo',
    'howto',
  ];

  const igCaption = `Save this for later! 📌 

Here is what most people don't realize about ${cleanTopic.toLowerCase()}:

1️⃣ It's 10x easier once you set up the initial framework
2️⃣ Small daily iterations beat random bursts of motivation
3️⃣ Don't overcomplicate your tech stack

Drop a '🔥' in the comments if you want the complete step-by-step PDF checklist sent directly to your DMs!

—
#reels #reelsinstagram #contentcreator #creators #entrepreneurlife #buildinpublic #videomarketing #tipsandtricks`;

  const ttCaption = `Wait till the end… 🤯 ${cleanTopic}! Would you try this or stick to the old way? Tell me in the comments 👇 #fyp #foryou #trending #lifehack #learnontiktok #techtok`;

  const fbDesc = `Thinking about ${cleanTopic.toLowerCase()}? Here is the exact strategy we used to get results fast. 

Let us know in the comments: What is your #1 roadblock right now? 

#Reels #CreatorTips #MustWatch`;

  const masterCaption = `🔥 ${cleanTopic}

Stop scrolling! Here is everything you need to know to take this to the next level today. Drop your thoughts below and share with a friend who needs this.`;

  return {
    masterCaption,
    suggestedTags: ytTags,
    platforms: {
      youtube: {
        title: ytTitle,
        description: ytDesc,
        tags: ytTags,
      },
      instagram: {
        caption: igCaption,
      },
      tiktok: {
        caption: ttCaption,
      },
      facebook: {
        description: fbDesc,
      },
    },
  };
}

/**
 * Mock API: Publish Video to Selected Platforms
 * Dispatches step-by-step progress callbacks for storage upload, transcoding,
 * and individual platform API dispatches.
 */
export async function publishToPlatforms(
  payload: VideoPayload,
  onProgress: (step: PublishStep, overallPercent: number) => void
): Promise<PublishResult> {
  const activePlatforms = (Object.keys(payload.selectedPlatforms) as PlatformId[]).filter(
    (key) => payload.selectedPlatforms[key]
  );

  if (activePlatforms.length === 0) {
    throw new Error('Please select at least one platform to publish to.');
  }

  const isScheduled = !!payload.schedule?.isScheduled;
  const totalUnits = 2 + activePlatforms.length; // storage + transcode + platforms
  let currentUnit = 0;

  // Step 1: Storage Upload
  onProgress(
    {
      id: 'upload',
      label: 'Uploading to Cloud Storage',
      description: `Compressing and uploading ${payload.video.name} (${payload.video.formattedSize})...`,
      status: 'in_progress',
      progress: 30,
    },
    Math.round((currentUnit / totalUnits) * 100)
  );
  await delay(700);

  onProgress(
    {
      id: 'upload',
      label: 'Uploading to Cloud Storage',
      description: 'Upload complete (9:16 vertical verified)',
      status: 'completed',
      progress: 100,
    },
    Math.round((++currentUnit / totalUnits) * 100)
  );
  await delay(350);

  // Step 2: Metadata & Asset Preparation
  onProgress(
    {
      id: 'transcode',
      label: 'Optimizing for Vertical Feed APIs',
      description: 'Generating optimized video thumbnails & H.264 profiles...',
      status: 'in_progress',
      progress: 60,
    },
    Math.round((currentUnit / totalUnits) * 100)
  );
  await delay(650);

  onProgress(
    {
      id: 'transcode',
      label: 'Optimizing for Vertical Feed APIs',
      description: 'Thumbnails and 1080x1920 stream ready',
      status: 'completed',
      progress: 100,
    },
    Math.round((++currentUnit / totalUnits) * 100)
  );
  await delay(300);

  const publishedPlatforms: PublishedPlatformResult[] = [];
  const randomSuffix = () => Math.random().toString(36).substring(2, 9);

  // Step 3: Platform Publishing Loop
  for (const platform of activePlatforms) {
    const platformNames: Record<PlatformId, string> = {
      youtube: 'YouTube Shorts',
      instagram: 'Instagram Reels',
      tiktok: 'TikTok',
      facebook: 'Facebook Reels',
    };

    const friendlyName = platformNames[platform];

    onProgress(
      {
        id: `send-${platform}`,
        platform,
        label: isScheduled ? `Scheduling on ${friendlyName}` : `Broadcasting to ${friendlyName}`,
        description: isScheduled
          ? `Queuing payload for ${new Date(payload.schedule?.scheduledAt || Date.now()).toLocaleString()}...`
          : `Dispatching video stream, captions, and platform tags...`,
        status: 'in_progress',
        progress: 50,
      },
      Math.round((currentUnit / totalUnits) * 100)
    );

    // Realistic API dispatch timing
    await delay(750);

    const postId = `${platform}_${randomSuffix()}`;
    let mockUrl = '';

    switch (platform) {
      case 'youtube':
        mockUrl = `https://youtube.com/shorts/${randomSuffix()}`;
        break;
      case 'instagram':
        mockUrl = `https://instagram.com/reel/C_${randomSuffix()}/`;
        break;
      case 'tiktok':
        mockUrl = `https://www.tiktok.com/@omnistudio/video/739${Math.floor(10000000 + Math.random() * 90000000)}`;
        break;
      case 'facebook':
        mockUrl = `https://www.facebook.com/reel/${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        break;
    }

    publishedPlatforms.push({
      platform,
      status: 'success',
      postId,
      url: mockUrl,
      publishedAt: new Date().toISOString(),
      viewsEstimate: `${(Math.random() * 8 + 1.2).toFixed(1)}k est. reach`,
    });

    onProgress(
      {
        id: `send-${platform}`,
        platform,
        label: isScheduled ? `Scheduled on ${friendlyName}` : `Live on ${friendlyName}`,
        description: isScheduled
          ? `Post queued successfully with server scheduler`
          : `Published live to ${friendlyName} feed`,
        status: 'completed',
        progress: 100,
      },
      Math.round((++currentUnit / totalUnits) * 100)
    );

    await delay(250);
  }

  return {
    success: true,
    timestamp: new Date().toISOString(),
    isScheduled,
    scheduledAt: payload.schedule?.scheduledAt,
    publishedPlatforms,
    summary: isScheduled
      ? `Successfully scheduled across ${activePlatforms.length} platform${activePlatforms.length > 1 ? 's' : ''}`
      : `Successfully published across ${activePlatforms.length} platform${activePlatforms.length > 1 ? 's' : ''}`,
  };
}
