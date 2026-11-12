export type PlatformId = 'youtube' | 'instagram' | 'tiktok' | 'facebook';

export interface PlatformAccount {
  id: PlatformId;
  name: string;
  handle: string;
  connected: boolean;
  avatarUrl: string;
  followers: string;
  verified?: boolean;
}

export interface VideoMetadata {
  name: string;
  sizeBytes: number;
  formattedSize: string;
  durationSeconds: number;
  formattedDuration: string;
  width: number;
  height: number;
  aspectRatio: string;
  fileUrl: string;
  thumbnailUrl?: string;
  file?: File;
  isSample?: boolean;
}

export interface YouTubeConfig {
  title: string; // Max 100
  description: string;
  visibility: 'public' | 'unlisted' | 'private';
  tags: string[];
  category: string;
  madeForKids: boolean;
}

export interface InstagramConfig {
  caption: string; // Max 2200
  shareToFeed: boolean;
  allowAudioRemix: boolean;
  locationTag: string;
}

export interface TikTokConfig {
  caption: string; // Max 2200
  privacy: 'public' | 'friends' | 'only_me';
  allowComments: boolean;
  allowDuet: boolean;
  allowStitch: boolean;
  commercialContent: boolean;
}

export interface FacebookConfig {
  description: string;
  audience: 'public' | 'friends';
  allowRemixing: boolean;
}

export interface PlatformConfig {
  youtube: YouTubeConfig;
  instagram: InstagramConfig;
  tiktok: TikTokConfig;
  facebook: FacebookConfig;
}

export interface ScheduleConfig {
  isScheduled: boolean;
  scheduledAt?: string; // ISO date string
}

export interface VideoPayload {
  video: VideoMetadata;
  masterTopic: string;
  masterCaption: string;
  platforms: PlatformConfig;
  selectedPlatforms: Record<PlatformId, boolean>;
  schedule?: ScheduleConfig;
}

export interface PublishStep {
  id: string;
  label: string;
  description: string;
  status: 'idle' | 'in_progress' | 'completed' | 'failed';
  platform?: PlatformId;
  progress?: number;
}

export interface PublishedPlatformResult {
  platform: PlatformId;
  status: 'success' | 'failed';
  postId: string;
  url: string;
  publishedAt: string;
  viewsEstimate?: string;
}

export interface PublishResult {
  success: boolean;
  timestamp: string;
  isScheduled: boolean;
  scheduledAt?: string;
  publishedPlatforms: PublishedPlatformResult[];
  summary: string;
}

export interface AICaptionResponse {
  masterCaption: string;
  suggestedTags: string[];
  platforms: {
    youtube: {
      title: string;
      description: string;
      tags: string[];
    };
    instagram: {
      caption: string;
    };
    tiktok: {
      caption: string;
    };
    facebook: {
      description: string;
    };
  };
}
