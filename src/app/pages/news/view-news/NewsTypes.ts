interface StoryCard {
  id: string;
  title: string;
  description: string;
  bannerImage: string | { path: string } | null;
}

interface VideoFile {
    internalFile?: { video?: string | null; thumbnail?: string | null; };
    externalFile?: { url?: string | null; type?: string | null; thumbnailUrl : string | null; };
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  bannerImage: string | { path: string } | null;
  video: VideoFile | null;
  storyCards: StoryCard[] | null;
  updatedAt: string;
  sourceUrl?: string;
  tags?: string[];
}
