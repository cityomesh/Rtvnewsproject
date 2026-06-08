import React from "react";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import "react-toastify/dist/ReactToastify.css";
import { KTIcon } from "../../../../_metronic/helpers";
import { NewsItem } from "./NewsTypes";
import { Chip } from "@mui/material";
import { getCurrentUser } from '../../../modules/auth/session';

interface SimpleNewsCardProps {
    newsItem: NewsItem;
    onReadMore: () => void;
    onEdit: () => void;
    onDelete: () => void;
    findDateTime: (timestamp: string) => [string, string];
}

export const SimpleNewsCard: React.FC<SimpleNewsCardProps> = ({ newsItem, onReadMore, onEdit, onDelete, findDateTime }) => {
    const currentUser = getCurrentUser();
    const isAdminUser = currentUser?.role === 'ADMIN';
    const isOwner = currentUser?.username === (newsItem as any).createdBy;
    
    // Show edit button for Admin OR Owner
    const showEditButton = isAdminUser || isOwner;
    // Show delete button only for Admin
    const showDeleteButton = isAdminUser;
    
    const imageUrl = typeof newsItem.bannerImage === 'string' ? newsItem.bannerImage : newsItem.bannerImage?.path;
    
    return (
        <div className="p-5 w-100">
            <div onClick={onReadMore} style={{ cursor: 'pointer' }}>
                <div className="d-flex flex-column mb-3">
                    <span className="text-gray-800 fs-6 fw-bold text-truncate" dangerouslySetInnerHTML={{ __html: newsItem.title }} />
                    <span className="text-gray-500 fw-semibold">{findDateTime(newsItem.updatedAt)[0]} | {findDateTime(newsItem.updatedAt)[1]}</span>
                </div>
                <div className="mb-5">
                    <div 
                        className="text-gray-800 fw-normal" 
                        style={{ overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
                        dangerouslySetInnerHTML={{ __html: newsItem.description }}
                    />
                    <div
                        className="bgi-no-repeat rounded min-h-250px mt-3"
                        style={{
                            backgroundImage: `url(${imageUrl || toAbsoluteUrl("/media/image-not-found.png")})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    ></div>
                </div>
            </div>
            {newsItem.tags && newsItem.tags.length > 0 && (
                <div className="mt-4 mb-2 d-flex flex-wrap" style={{gap: '0.5rem'}}>
                    {newsItem.tags.slice(0, 3).map((tag, index) => (
                        <Chip key={index} label={tag} variant="outlined" size="small" />
                    ))}
                    {newsItem.tags.length > 3 && (
                        <Chip label="..." variant="outlined" size="small" />
                    )}
                </div>
            )}
            <div className="d-flex align-items-center justify-content-center">
                {showEditButton && (
                    <button onClick={onEdit} className="btn btn-sm btn-light btn-color-muted btn-active-light-success px-4 py-2 me-4">
                        <KTIcon iconName="pencil" className="fs-2 text-primary" />
                    </button>
                )}
                {showDeleteButton && (
                    <button onClick={onDelete} className="btn btn-sm btn-light btn-color-muted btn-active-light-danger px-4 py-2">
                        <KTIcon iconName="trash" className="fs-2 text-danger" />
                    </button>
                )}
            </div>
        </div>
    );
};
