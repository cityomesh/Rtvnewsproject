import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material/';
import { NewsItem } from './NewsTypes';
import { KTIcon } from '../../../../_metronic/helpers';
import { toAbsoluteUrl } from '../../../../_metronic/helpers';
import { getYouTubeVideoId, containsFacebookUrl } from '../../../../utils/GetYoutubeLink';

interface NewsListItemProps {
  newsItem: NewsItem;
  onReadMore: () => void;
  onEdit: () => void;
  onDelete: () => void;
  findDateTime: (timestamp: string) => [string, string];
}

export const NewsListItem: React.FC<NewsListItemProps> = ({ newsItem, onReadMore, onEdit, onDelete, findDateTime }) => {
    const defaultImage = toAbsoluteUrl("/media/image-not-found.png");
    const getThumbnailUrl = (): string => {
        const { bannerImage, video, storyCards } = newsItem;

        if (storyCards && storyCards.length > 0) {
            const firstCardImage = storyCards[0].bannerImage;
            return typeof firstCardImage === 'string' ? firstCardImage : firstCardImage?.path || defaultImage;
        }

        if (video) {
            if (video.externalFile?.thumbnailUrl) {
                return video.externalFile.thumbnailUrl;
            }
            if (video.internalFile?.thumbnail) {
                return video.internalFile.thumbnail;
            }
            const externalUrl = video.externalFile?.url;
            if (externalUrl) {
                if (externalUrl.includes('youtube.com') || externalUrl.includes('youtu.be')) {
                    const videoId = getYouTubeVideoId(externalUrl);
                    if (videoId) return `https://img.youtube.com/vi/${videoId}/0.jpg`;
                }
            }
            return defaultImage;
        }

        if (bannerImage) {
            return typeof bannerImage === 'string' ? bannerImage : bannerImage.path || defaultImage;
        }
        
        return defaultImage;
    };

    const { video: videoData } = newsItem;
    const externalUrl = videoData?.externalFile?.url;
    let platform = 'internal';
    if (externalUrl) {
        if (externalUrl.includes('youtube.com') || externalUrl.includes('youtu.be')) {
            platform = 'youtube';
        } else if (externalUrl.includes('twitter.com') || externalUrl.includes('x.com')) {
            platform = 'twitter';
        } else if (externalUrl.includes('instagram.com')) {
            platform = 'instagram';
        } else if (containsFacebookUrl(externalUrl)) {
            platform = 'facebook';
        } else {
            platform = 'external';
        }
    }

    const getIcon = () => {
        switch (platform) {
            case 'youtube':
                return <KTIcon iconName="youtube" className="fs-3x text-danger" />;
            case 'twitter':
                return <KTIcon iconName="twitter" className="fs-3x text-primary" />;
            case 'instagram':
                return <KTIcon iconName="instagram" className="fs-3x text-danger" />;
            case 'facebook':
                return <KTIcon iconName="facebook-square" className="fs-3x text-primary" />;
            default:
                return null;
        }
    };

    const thumbnailUrl = getThumbnailUrl();
    const [date, time] = findDateTime(newsItem.updatedAt);
    const isDefaultThumbnail = thumbnailUrl === defaultImage;

    return (
        <Paper elevation={2} sx={{ display: 'flex', width: '100%', height: '100%' }}>
            <Box
                onClick={onReadMore}
                sx={{
                    width: { xs: 120, sm: 180 },
                    cursor: 'pointer',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: `url(${thumbnailUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {isDefaultThumbnail && getIcon()}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 2, justifyContent: 'space-between' }}>
                <div>
                    <Typography component="div" variant="h6" onClick={onReadMore} style={{ cursor: 'pointer', overflow: "hidden", textOverflow: "ellipsis", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }} dangerouslySetInnerHTML={{ __html: newsItem.title }} />
                    <Typography variant="subtitle2" color="text.secondary" component="div">
                        {date} | {time}
                    </Typography>
                    {newsItem.tags && newsItem.tags.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, mb: 1 }}>
                            {newsItem.tags.slice(0, 3).map((tag, index) => (
                                <Chip key={index} label={tag} variant="outlined" size="small" />
                            ))}
                            {newsItem.tags.length > 3 && (
                                <Chip label="..." variant="outlined" size="small" />
                            )}
                        </Box>
                    )}
                    <Typography variant="body2" color="text.secondary" component="p" sx={{ overflow: "hidden", textOverflow: "ellipsis", WebkitLineClamp: { xs: 2, sm: 3 }, WebkitBoxOrient: "vertical", my: 1,  display: { xs: 'none', sm: '-webkit-box' } }} dangerouslySetInnerHTML={{ __html: newsItem.description }}/>
                </div>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
                    <button onClick={onEdit} className="btn btn-sm btn-light btn-color-muted btn-active-light-success px-4 py-2 me-4">
                      <KTIcon iconName="pencil" className="fs-2 text-primary" />
                    </button>
                    <button onClick={onDelete} className="btn btn-sm btn-light btn-color-muted btn-active-light-danger px-4 py-2">
                      <KTIcon iconName="trash" className="fs-2 text-danger" />
                    </button>
                </Box>
            </Box>
        </Paper>
    );
};
