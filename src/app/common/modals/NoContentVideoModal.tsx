import React, { useEffect, useState } from 'react';
// import './style.css';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';

// Define the type for the props
interface VideoModalProps {
  isOpen: boolean;

    toggleModal: () => void;
    videoUrl: string;
    
}

const NoContentVideoModal: React.FC<VideoModalProps> = ({ isOpen, videoUrl, toggleModal }) => {

    let [cleanedData, setcleanedData] = useState<string>("");
    let [trimData, setTrimData] = useState<string>("");

    // cleanedData = description?.replace(/<br\s*\/?>/gi, '');
    useEffect(()=> {
        
    }, []);

    if (!isOpen) return null;
    console.log()
    return (
      <div className="custom-modal-overlay" 
        style={{ 
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center", 
        }}>
        <div className="custom-modal" style={{ width: "700px", height: "66%"}}>
          <div className='video-container' style={{ width: "100%", height: "100%"}}>
            <button onClick={toggleModal} className="custom-modal-close">
              &times;
            </button>
            <div className="card-model bg-gray-400" style={{ width: "100%", height: "100%"}}>
              <div className="video-section" style={{ width: "100%", height: "100%"}}>
                <video className="card-video" controls autoPlay>
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            {/* <div className="content-section" style={{backgroundColor: '#dfdede', marginLeft: '2%'}}>
              {title && <h2>{title}</h2>}
              {cleanedData && <div 
              dangerouslySetInnerHTML={{ __html: cleanedData}}/>}
            </div> */}
          </div>
        </div>
      </div>
    );
  };
  

export default NoContentVideoModal;