import React from 'react';
import './style.css';

interface VideoModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  videoPlayer: React.ReactNode;
  title?: string;
  rejectionReason?: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, toggleModal, videoPlayer, title, rejectionReason }) => {
    if (!isOpen) return null;

    return (
      <div className="custom-modal-overlay" onClick={toggleModal}>
        <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header">
                <h3 className="custom-modal-title">{title || 'Video'}</h3>
                <button onClick={toggleModal} className="custom-modal-close">
                  &times;
                </button>
            </div>
            <div className="custom-modal-content">
                {videoPlayer}
            </div>
            {rejectionReason && (
                <div className="custom-modal-footer">
                    <strong>Rejection Reason:</strong>
                    <p>{rejectionReason}</p>
                </div>
            )}
        </div>
      </div>
    );
};

export default VideoModal;