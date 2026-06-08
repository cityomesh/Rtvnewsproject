import client from './network';

export interface DashboardCounts {
  newsCount: number;
  quizCount: number;
  postCount: number;
  pollCount: number;
  reelCount: number;
  reviewReelsCount: number;
}

class DashboardService {
  private cachedCounts: DashboardCounts | null = null;

  async getAllCounts(): Promise<DashboardCounts> {
    try {
      console.log('🚀 Fetching all counts from API...');
      
      const [newsCount, quizCount, postCount, pollCount, reelCount, reviewReelsCount] = await Promise.all([
        this.getNewsTotalCount(),
        this.getQuizTotalCount(),
        this.getPostTotalCount(),
        this.getPollTotalCount(),
        this.getReelTotalCount(),
        this.getReviewReelsCount(),
      ]);
      
      const counts: DashboardCounts = {
        newsCount: newsCount,
        quizCount: quizCount,
        postCount: postCount,
        pollCount: pollCount,
        reelCount: reelCount,
        reviewReelsCount: reviewReelsCount,
      };
      
      this.cachedCounts = counts;
      console.log('📊 Final Counts:', counts);
      
      return counts;
    } catch (error) {
      console.error('Error fetching counts:', error);
      return this.getCachedCounts();
    }
  }

  // Get total news count - Fetch ALL news (not just first page)
  private async getNewsTotalCount(): Promise<number> {
    try {
      // First, try to get total count from response headers or metadata
      // Fetch first page with size=1 to get total elements from response
      const firstPageResponse = await client.get('/news', {
        params: { page: 0, size: 1, sort: 'updatedAt,desc' }
      });
      
      // Try to get total from response structure
      if (firstPageResponse.data?.totalElements) {
        console.log(`📰 Total News (from metadata): ${firstPageResponse.data.totalElements}`);
        return firstPageResponse.data.totalElements;
      }
      
      if (firstPageResponse.data?.total) {
        console.log(`📰 Total News (from total field): ${firstPageResponse.data.total}`);
        return firstPageResponse.data.total;
      }
      
      if (firstPageResponse.data?.page?.totalElements) {
        console.log(`📰 Total News (from page.totalElements): ${firstPageResponse.data.page.totalElements}`);
        return firstPageResponse.data.page.totalElements;
      }
      
      // If no metadata, fetch all news with large page size
      const response = await client.get('/news', {
        params: { page: 0, size: 10000, sort: 'updatedAt,desc' }
      });
      
      let count = 0;
      
      // Check if response is array
      if (Array.isArray(response.data)) {
        count = response.data.length;
      } 
      // Check if response has content array (paginated response)
      else if (response.data?.content && Array.isArray(response.data.content)) {
        count = response.data.content.length;
        // If has totalElements, use that instead
        if (response.data.totalElements) {
          count = response.data.totalElements;
        }
      }
      // Check if response has data array
      else if (response.data?.data && Array.isArray(response.data.data)) {
        count = response.data.data.length;
      }
      
      console.log(`📰 Total News: ${count}`);
      return count;
    } catch (error) {
      console.error('Error fetching news count:', error);
      return 0;
    }
  }

  // Get total quiz count
  private async getQuizTotalCount(): Promise<number> {
    try {
      const response = await client.get('/quiz/search', {
        params: { page: 0, size: 10000 }
      });
      
      const count = this.getCountFromResponse(response.data);
      console.log(`📝 Total Quizzes: ${count}`);
      return count;
    } catch (error) {
      console.error('Error fetching quiz count:', error);
      return 0;
    }
  }

  // Get total post count
  private async getPostTotalCount(): Promise<number> {
    try {
      const response = await client.get('/post/dashboard/search', {
        params: { page: 0, size: 10000 }
      });
      
      const count = this.getCountFromResponse(response.data);
      console.log(`📰 Total Posts: ${count}`);
      return count;
    } catch (error) {
      console.error('Error fetching post count:', error);
      return 0;
    }
  }

  // Get total poll count
  private async getPollTotalCount(): Promise<number> {
    try {
      const response = await client.get('/polls/feed/search', {
        params: { page: 0, size: 10000 }
      });
      
      const count = this.getCountFromResponse(response.data);
      console.log(`📊 Total Polls: ${count}`);
      return count;
    } catch (error) {
      console.error('Error fetching poll count:', error);
      return 0;
    }
  }

  // Get total reel count
  private async getReelTotalCount(): Promise<number> {
    try {
      const [completeReels, underReviewReels] = await Promise.all([
        this.getReelsByStatus('REVIEW_COMPLETE'),
        this.getReelsByStatus('UNDER_REVIEW'),
      ]);
      
      const totalReels = completeReels + underReviewReels;
      console.log(`🎬 Total Reels: ${totalReels} (Complete: ${completeReels}, Under Review: ${underReviewReels})`);
      return totalReels;
    } catch (error) {
      console.error('Error fetching reel count:', error);
      return 0;
    }
  }

  // Get reels by status
  private async getReelsByStatus(status: string): Promise<number> {
    try {
      const response = await client.get('/reels/dashboard/search', {
        params: { status: status, page: 0, size: 10000 }
      });
      return this.getCountFromResponse(response.data);
    } catch (error) {
      console.error(`Error fetching ${status} reels:`, error);
      return 0;
    }
  }

  // Get review reels count (UNDER_REVIEW status)
  private async getReviewReelsCount(): Promise<number> {
    try {
      const response = await client.get('/reels/dashboard/search', {
        params: { status: 'UNDER_REVIEW', page: 0, size: 10000 }
      });
      const count = this.getCountFromResponse(response.data);
      console.log(`📹 Review Reels (Under Review): ${count}`);
      return count;
    } catch (error) {
      console.error('Error fetching review reels count:', error);
      return 0;
    }
  }

  private getCountFromResponse(data: any): number {
    if (!data) return 0;
    if (typeof data === 'number') return data;
    if (Array.isArray(data)) return data.length;
    if (data.totalElements) return data.totalElements;
    if (data.total) return data.total;
    if (data.count) return data.count;
    if (data.content && Array.isArray(data.content)) return data.content.length;
    if (data.data && Array.isArray(data.data)) return data.data.length;
    if (data.results && Array.isArray(data.results)) return data.results.length;
    if (data.items && Array.isArray(data.items)) return data.items.length;
    if (data.pagination?.total) return data.pagination.total;
    if (data.meta?.total) return data.meta.total;
    if (data.page?.totalElements) return data.page.totalElements;
    if (data.numberOfElements !== undefined) return data.numberOfElements;
    
    return 0;
  }

  private getCachedCounts(): DashboardCounts {
    if (this.cachedCounts) {
      return this.cachedCounts;
    }
    return {
      newsCount: 0,
      quizCount: 0,
      postCount: 0,
      pollCount: 0,
      reelCount: 0,
      reviewReelsCount: 0,
    };
  }

  async refresh(): Promise<DashboardCounts> {
    this.cachedCounts = null;
    return this.getAllCounts();
  }
}

export default new DashboardService();
