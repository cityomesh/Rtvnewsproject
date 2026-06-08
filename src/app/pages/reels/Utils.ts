  export const getVideoUrl = (reel: any) => {
    return reel?.video?.internalFile?.video || reel?.video?.externalFile?.url || null;
  };

  export const getThumbnailUrl = (reel: any) => {
    return reel?.video?.internalFile?.thumbnail || reel?.thumbnail || reel?.video?.externalFile?.thumbnailUrl || null;
  };

  export const isYouTubeUrl = (url: string) => {
    return url?.includes('youtube.com') || url?.includes('youtu.be');
  };

  export const getYouTubeEmbedUrl = (url: string) => {
    const patterns = [
      /youtube\.com\/shorts\/([^?]+)/,
      /youtube\.com\/watch\?v=([^&]+)/,
      /youtu\.be\/([^?]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1`;
      }
    }
    return null;
  };

  export const getYouTubeThumbnail = (url: string) => {
    const patterns = [
      /youtube\.com\/shorts\/([^?]+)/,
      /youtube\.com\/watch\?v=([^&]+)/,
      /youtu\.be\/([^?]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
      }
    }
    return null;
  };

  export const isTwitterUrl = (url: string): boolean => {
  return url?.includes('twitter.com') || url?.includes('x.com');
};

  export const isFacebookUrl = (url: string): boolean => {
    return url?.includes('facebook.com') || url?.includes('fb.watch');
  };


  export const getTweetId = (url: string): string | null => {
  const match = url.match(/status\/(\d+)/);
  return match ? match[1] : null;
  };

  export const extractUrlFromTweetEmbed = (embedCode: string): string | null => {
  const match = embedCode.match(/<a\s+href="([^"]+)"/g);
  if (match && match.length > 0) {
    const lastLink = match[match.length - 1];
    const urlMatch = lastLink.match(/href="([^"]+)"/);
    if (urlMatch) {
      const finalUrl = urlMatch[1];
      const url = new URL(finalUrl);
      url.search = '';
      return url.toString();
    }
  }
  return null;
  };