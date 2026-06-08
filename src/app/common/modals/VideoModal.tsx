import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  useTheme,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/joy/CircularProgress';

interface VideoModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  videoPlayer?: React.ReactNode| string;
  title?: string;
  description?: string;
  rejectionReason?: string;
  data?: any;
}
const stripHtml = (html: string): string => {
  return html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '');
};

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  videoPlayer,
  title,
  description,
  toggleModal,
  rejectionReason,
  data
}) => {
  const theme = useTheme();
  const cleanedDescription = stripHtml(description || '');
  // const isYouTube = isYouTubeUrl(videoUrl || '');
  // const embedUrl = isYouTube ? getYouTubeEmbedUrl(videoUrl || '') : '';
  

  const hasData = data && Object.keys(data).length > 0;
  const hasTitle = (title ?? '').trim().length > 0;
  const hasDescription = cleanedDescription.trim().length > 0;
  const hasRejection = (rejectionReason ?? '').trim().length > 0;
  const hasContent = hasTitle || hasDescription || hasRejection || hasData;
  const isYouTubeUrl = (url: string = ''): boolean =>
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);

  return (
    <Dialog
      open={isOpen}
      onClose={toggleModal}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          height: '90vh',
          display: 'flex',
          borderRadius: 2,
          overflow: 'hidden',
        },
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={toggleModal}
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          backgroundColor: 'red',
          color: 'white',
          '&:hover': {
            backgroundColor: '#cc0000',
          },
          width: 36,
          height: 36,
          zIndex: 2,
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: hasContent ? { xs: 'column', sm: 'row' } : 'column',
          height: '100%',
          p: 0,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            flex: hasContent ? 1 : '1 1 100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {videoPlayer}
        </Box>

        {hasContent && (
          <Box
            sx={{
              width: { xs: '100%', sm: '40%' },
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              overflowY: 'auto',
            }}
          >
            {(hasTitle || data?.trainingRating >= 1) && (
              <Box display="flex" justifyContent="space-between" alignItems="center">
                {hasTitle && (
                  <Typography variant="h5" color="text.primary" fontWeight={600}>
                    {title}
                  </Typography>
                )}
                {data?.trainingRating >= 1 && (
                  <CircularProgress
                    determinate
                    value={(data.trainingRating * 100) / 10}
                    sx={{ '--CircularProgress-size': '50px', color: 'gray' }}
                  >
                    {data.trainingRating} / 10
                  </CircularProgress>
                )}
              </Box>
            )}

            {hasDescription && (
              <Box
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: '0.95rem',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.5,
                }}
              >
                {cleanedDescription}
              </Box>
            )}

            {hasRejection && (
              <Box
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: '0.95rem',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.5,
                }}
              >
                <Typography variant="h6" color="error" fontWeight={600} gutterBottom>
                  Rejection Reason:
                </Typography>
                <Typography>{rejectionReason}</Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
