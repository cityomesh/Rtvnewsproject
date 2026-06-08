
export function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([^/?#]+)/,       // youtu.be/<id>
    /youtube\.com\/live\/([^/?#]+)/, // youtube.com/live/<id>
    /youtube\.com\/watch\?v=([^&]+)/, // youtube.com/watch?v=<id>
    /youtube\.com\/shorts\/([^/?#]+)/, // youtube.com/shorts/<id>
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

// Helper function to get Twitter/X video embed
export const getTwitterEmbedUrl = (url: string): string | null => {
  const tweetId = url.match(/status\/(\d+)/)?.[1];
  if (tweetId) {
    return `https://platform.twitter.com/embed/Tweet.html?id=${tweetId}`;
  }
  return null;
};

// Helper function to get Instagram embed
export const getInstagramEmbedUrl = (url: string): string | null => {
  const postMatch = url.match(/\/p\/([A-Za-z0-9_-]+)/);
  const reelMatch = url.match(/\/reel\/([A-Za-z0-9_-]+)/);
  if (postMatch) {
    return `https://www.instagram.com/p/${postMatch[1]}/embed/`;
  } else if (reelMatch) {
    return `https://www.instagram.com/reel/${reelMatch[1]}/embed/`;
  }
  return null;
};

// Helper to check for Facebook URLs
export function containsFacebookUrl(input: string): boolean {
  return input.includes("facebook.com");
}

// Helper to get the correct Facebook embed URL for an iframe
export function getFacebookEmbedReel(url: string): string | null {
  if (
    url.includes("facebook.com/reel/") ||
    url.includes("facebook.com/watch/") ||
    url.includes("facebook.com/video.php") ||
    url.match(/facebook\.com\/.*\/videos\//)
  ) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      url
    )}&show_text=false&width=auto&autoplay=true`;
  }
  return null;
}

export function getIframeEmbedCode(url: string): string | null {
  if (url.includes("<iframe")) {
   return url;
  }
  return null;
}