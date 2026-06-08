import { Button, Grid2, Stack, Typography, useTheme, useMediaQuery, Box, CircularProgress, Chip } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import news from '../../../../public/media/dashboard-icons/News.png';
import quiz from '../../../../public/media/dashboard-icons/Quiz.png';
import reel from '../../../../public/media/dashboard-icons/Reel.png';
import post from '../../../../public/media/dashboard-icons/Post.png';
import poll from '../../../../public/media/dashboard-icons/Poll.png';
import review from '../../../../public/media/dashboard-icons/Review.png';
import dashboardService from '../../modules/service/dashboardService';
import { toast } from 'react-toastify';

interface DashboardCounts {
  newsCount: number;
  quizCount: number;
  postCount: number;
  pollCount: number;
  reelCount: number;
  reviewReelsCount: number;
}

export default function DashboardPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [counts, setCounts] = useState<DashboardCounts>({
    newsCount: 0,
    quizCount: 0,
    postCount: 0,
    pollCount: 0,
    reelCount: 0,
    reviewReelsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    fetchCounts();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchCounts(true);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchCounts = async (silent: boolean = false) => {
    try {
      if (!silent) setLoading(true);
      setIsRefreshing(true);
      
      const data = await dashboardService.getAllCounts();
      setCounts(data);
      
      if (!silent) {
        toast.success('Dashboard updated!');
      }
      
      console.log('Counts updated:', data);
    } catch (error) {
      console.error('Failed to fetch counts:', error);
      if (!silent) {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const stackStyles = {
    width: '100%',
    height: '100%',
    position: 'relative',
    alignItems: 'stretch',
    p: { xs: 1, sm: 2, md: 3, lg: 4 },
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
    maxWidth: '1400px',
    mx: 'auto',
  }

  const getCustomButtonStyles = () => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    height: { xs: '36px', sm: '40px', md: '44px' },
    background: '#FFFFFF',
    borderRadius: { xs: '8px', sm: '10px', md: '12px' },
    flex: '1',
    textTransform: 'none',
    fontWeight: '500',
    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
    px: { xs: 1.5, sm: 2, md: 3 },
    py: { xs: 1, sm: 1.25, md: 1.5 },
    border: '1px solid #e0e7ff',
    color: '#64748b',
    minWidth: 0,
    width: '100%',
    '&:hover': {
      background: '#f8fafc',
      borderColor: '#cbd5e1',
      transform: 'translateY(-1px)',
      transition: 'all 0.2s ease-in-out'
    }
  });

  const CardData = [
    {
      title: 'News',
      icon: news,
      count: counts.newsCount,
      primaryAction: '+ Create News',
      secondaryAction: 'View All News',
      click: () => navigate('/news/create'),
      subClick: () => navigate('/news'),
    },
    {
      title: 'Quiz',
      icon: quiz,
      count: counts.quizCount,
      primaryAction: '+ Create Quiz',
      secondaryAction: 'View All Quizzes',
      click: () => navigate('/quiz/create'),
      subClick: () => navigate('/quiz'),
    },
    {
      title: 'Post',
      icon: post,
      count: counts.postCount,
      primaryAction: '+ Create Post',
      secondaryAction: 'View All Posts',
      click: () => navigate('/post/create'),
      subClick: () => navigate('/posts'),
    },
    {
      title: 'Poll',
      icon: poll,
      count: counts.pollCount,
      primaryAction: '+ Create Poll',
      secondaryAction: 'View All Polls',
      click: () => navigate('/poll/create'),
      subClick: () => navigate('/polls'),
    },
  {
    title: 'Reel',
    icon: reel,
    count: counts.reelCount,
    primaryAction: '+ Create Reel',
    secondaryAction: 'View All Reels',
    click: () => navigate('/reels/create'),
    subClick: () => navigate('/reels'),
  },
  {
    title: 'Review Reels',
    icon: review,
    count: counts.reviewReelsCount,  // This will show UNDER_REVIEW count
    primaryAction: 'Review Reels',
    secondaryAction: '',
    click: () => navigate('/reels/review'),
    subClick: () => {},
  },
  ];

  if (loading && !isRefreshing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Grid2 container sx={stackStyles}>
        {CardData.map((card, index) => {
          return (
            <Box
              key={index}
              sx={{
                width: '100%',
                minHeight: 'fit-content',
                bgcolor: 'white',
                borderRadius: { xs: '12px', sm: '14px', md: '16px' },
                border: '1px solid #e0e7ff',
                p: { xs: 2, sm: 2.5, md: 3 },
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 1.5, sm: 2, md: 2.5 },
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: { xs: '0 2px 8px rgba(0, 0, 0, 0.12)', sm: '0 4px 12px rgba(0, 0, 0, 0.15)' },
                  transform: { xs: 'translateY(-1px)', sm: 'translateY(-2px)' },
                }
              }}
            >
              <Stack 
                direction="row" 
                alignItems="center" 
                justifyContent="space-between"
                gap={{ xs: 1, sm: 1.25, md: 1.5 }}
              >
                <Stack direction="row" alignItems="center" gap={1.5}>
                  <Box
                    sx={{
                      width: { xs: 36, sm: 42, md: 48 },
                      height: { xs: 36, sm: 42, md: 48 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: { xs: '6px', sm: '7px', md: '8px' },
                      bgcolor: '#f8fafc',
                      flexShrink: 0,
                    }}
                  >
                    <img 
                      src={card.icon}
                      alt={card.title} 
                      width={isMobile ? 20 : isSmallTablet ? 24 : 28} 
                      height={isMobile ? 20 : isSmallTablet ? 24 : 28} 
                      style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
                    />
                  </Box>
                  <Typography 
                    variant={isMobile ? "subtitle1" : "h6"}
                    fontWeight="600"
                    color="text.primary"
                    sx={{
                      fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                      lineHeight: 1.3,
                    }}
                  >
                    {card.title}
                  </Typography>
                </Stack>
                
                <Chip 
                  label={`${card.count}`}
                  color="primary"
                  variant="filled"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                    height: { xs: 32, sm: 36, md: 40 },
                    '& .MuiChip-label': { px: 1.5 }
                  }}
                />
              </Stack>

              <Stack 
                direction={{ xs: 'column', lg: 'row' }}
                gap={{ xs: 1, sm: 1.25, md: 1.5 }}
                alignItems="stretch"
                sx={{ mt: 'auto' }}
              >
                <Button
                  onClick={card.click}
                  variant="contained"
                  sx={{
                    ...getCustomButtonStyles(),
                    backgroundColor: '#1b84ff',
                    color: 'white',
                    border: 'none',
                    '&:hover': { backgroundColor: '#1674e0', transform: 'translateY(-1px)' },
                    ...(!card.secondaryAction && { flex: { lg: '0 1 calc(50% - 4px)' } })
                  }}
                >
                  {card.primaryAction}
                </Button>
                
                {card.secondaryAction && (
                  <Button
                    onClick={card.subClick}
                    variant="outlined"
                    sx={getCustomButtonStyles()}
                  >
                    {card.secondaryAction}
                  </Button>
                )}
              </Stack>
            </Box>
          );
        })}
      </Grid2>
      
      {/* Only Refresh Button - No timing */}
      <Box sx={{ textAlign: 'center', py: 2, mt: 2 }}>
        <Button 
          variant="contained"
          color="secondary"
          onClick={() => fetchCounts(false)}
          disabled={isRefreshing}
          startIcon={isRefreshing ? <CircularProgress size={20} /> : null}
          sx={{ px: 4, py: 1 }}
        >
          {isRefreshing ? 'Refreshing...' : '🔄 Refresh'}
        </Button>
      </Box>
    </>
  )
}
