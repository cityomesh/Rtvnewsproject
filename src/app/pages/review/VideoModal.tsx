import React from 'react';
// import './style.css';

// Define the type for the props
interface VideoModalProps {
  isOpen: boolean;
//   onRequestClose: () => void;
    toggleModal: () => void;
    videoUrl: string;
}

// Set app element to improve accessibility (React Modal requires this)
const VideoModal: React.FC<VideoModalProps> = ({ isOpen, videoUrl, toggleModal }) => {
  if (!isOpen) return null;

    return (
      <div className="custom-modal-overlay">
        <div className="custom-modal" style={{ width: "600px", height: "400px", }}>
          <button onClick={toggleModal} className="custom-modal-close" style={{ zIndex: '100' }}>
            &times;
          </button>
          <div className="custom-modal-content" style={{ width: "100%", height: "100%", }}>
            <video width="100%" height="100%" controls autoPlay>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    );
  };
  

export default VideoModal;