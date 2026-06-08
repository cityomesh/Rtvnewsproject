import React from "react";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import "react-toastify/dist/ReactToastify.css";
import { KTIcon } from "../../../../_metronic/helpers";
import { NewsItem } from "./NewsTypes";
import { getYouTubeVideoId, containsFacebookUrl } from "../../../../utils/GetYoutubeLink";
import { Chip } from "@mui/material";

interface VideoNewsCardProps {
    newsItem: NewsItem;
    onReadMore: () => void;
    onEdit: () => void;
    onDelete: () => void;
    findDateTime: (timestamp: string) => [string, string];
}
export const VideoNewsCard: React.FC<VideoNewsCardProps> = ({ newsItem, onReadMore, onEdit, onDelete, findDateTime }) => {
    const { video: videoData } = newsItem;
    const externalUrl = videoData?.externalFile?.url;
    const defaultImage = toAbsoluteUrl("/media/image-not-found.png");
    let thumbnailUrl = videoData?.externalFile?.thumbnailUrl || 
                       videoData?.internalFile?.thumbnail;
    let platform = 'internal';

    if (externalUrl) {
        if (externalUrl.includes('youtube.com') || externalUrl.includes('youtu.be')) {
            platform = 'youtube';
            if (!thumbnailUrl) {
                const videoId = getYouTubeVideoId(externalUrl);
                if (videoId) {
                    thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
                }
            }
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
    const hasCustomThumbnail = !!thumbnailUrl;
    if (!thumbnailUrl) {
        thumbnailUrl = defaultImage;
    }

    const getIcon = () => {
        switch (platform) {
            case 'youtube':
                return <KTIcon iconName="youtube" className="fs-5x text-danger opacity-75" />;
            case 'twitter':
                return <KTIcon iconName="twitter" className="fs-5x text-primary opacity-75" />;
            case 'instagram':
                return <KTIcon iconName="instagram" className="fs-5x text-danger opacity-75" />;
            case 'facebook':
                return <KTIcon iconName="facebook" className="fs-5x text-primary opacity-75" />;
            default:
                return null; 
        }
    };

    return (
        <div className="p-5 w-100">
            <div className="d-flex flex-column mb-3" onClick={onReadMore} style={{ cursor: 'pointer' }}>
                <span
                    className="text-gray-800 fs-6 fw-bold text-truncate"
                    dangerouslySetInnerHTML={{ __html: newsItem.title }}
                />
                <span className="text-gray-500 fw-semibold">{findDateTime(newsItem.updatedAt)[0]} | {findDateTime(newsItem.updatedAt)[1]}</span>
            </div>
            <div
                className="text-gray-800 fw-normal mb-5"
                style={{ overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
                dangerouslySetInnerHTML={{ __html: newsItem.description }}
            />
            <div
                className="bgi-no-repeat rounded min-h-250px mb-5"
                style={{
                    backgroundImage: `url(${thumbnailUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                }}
                onClick={onReadMore}
            >
                {!hasCustomThumbnail && getIcon()}
            </div>
            {newsItem.tags && newsItem.tags.length > 0 && (
                <div className="mb-4 d-flex flex-wrap" style={{gap: '0.5rem'}}>
                    {newsItem.tags.slice(0, 3).map((tag, index) => (
                        <Chip key={index} label={tag} variant="outlined" size="small" />
                    ))}
                    {newsItem.tags.length > 3 && (
                        <Chip label="..." variant="outlined" size="small" />
                    )}
                </div>
            )}
            <div className="d-flex align-items-center justify-content-center">
                <button onClick={onEdit} className="btn btn-sm btn-light btn-color-muted btn-active-light-success px-4 py-2 me-4">
                    <KTIcon iconName="pencil" className="fs-2 text-primary" />
                </button>
                <button onClick={onDelete} className="btn btn-sm btn-light btn-color-muted btn-active-light-danger px-4 py-2">
                    <KTIcon iconName="trash" className="fs-2 text-danger" />
                </button>
            </div>
        </div>
    );
 };