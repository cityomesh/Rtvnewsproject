/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/prefer-as-const */
/* eslint-disable prefer-const */
/* eslint-disable no-var */
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CircularProgress from '@mui/joy/CircularProgress';
import { KTIcon } from "../../../_metronic/helpers";
import { Modal, Box, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { toast } from "react-toastify";
import { useState } from "react";
// import VideoModal from './VideoModal';
import VideoModal from "../../common/modals/VideoModal";
import './style.css';
import NoContentVideoModal from "../../common/modals/NoContentVideoModal";

interface RevCardCardProps {
    data: any
}



const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const RevVideoCard: React.FC<RevCardCardProps> = ({data})=>{
    
    const [open, setOpen] = useState<boolean>(false);
    var [readButton, setReadButton] = useState<boolean>(true);
    let [cleanedData, setcleanedData] = useState<string>("");
    let [trimData, setTrimData] = useState<string>("");
    
    const navigate = useNavigate();
    
   
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const toggleModal = ()=>{
        setIsDialogOpen(!isDialogOpen);
    }
    

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    cleanedData = data?.reviewComment?.replace(/<br\s*\/?>/gi, '')
    const videoPlayer = (
      <video style={{ width: "100%", height: "100%" }} controls autoPlay>
        <source src={data?.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
    

    useEffect(()=> {
        if(cleanedData?.length > 90) {
            setTrimData(cleanedData?.substring(0, 90)?.trim().concat("..."));
        }else {
            setTrimData(cleanedData);
        }
        if(cleanedData?.length < 50) {
            setReadButton(false)  
        }
    }, []);
       
    
    const handleClick = async (id: String)=> {
        try{
            navigate(`/review/underReview/${id}`);
        }
        catch(err){
            toast.error("Failed to fetch");
        }
      }

    return (
        <>

<div className= {data.reviewStatus === "REVIEW_COMPLETE" ? 'card-container-div' : 'card-container-under-review'}>
    {/* card for review video  */}
    <div className="card" style={{ height: '380px'}} >
    
    
    <img src={data.thumbnailUrl} alt={"training video image"} className="card-img-top" height="250px" style={{borderRadius: "8px 8px 0px 0px"}}/>
    
    <div className="card-body" style={{ marginTop: "-16px"}}>
        {!isDialogOpen && <div onClick={toggleModal} style={{ position: 'absolute',top: '25%',
            left: '40%',
            fontSize: '2rem',color: '#4b5675', cursor: "pointer"}}>
            <PlayCircleOutlineIcon sx={{ fontSize: 60 }} />
        
        </div>}
        {/* card body */}
        <div className="d-flex flex-column">
            <div className="">
                <h5 className="card-title">{data.title.length > 70
                              ? `${data.title.trim().slice(0, 70)}... `
                              : data.title}</h5>
            </div>
            {data.reviewStatus !== "REVIEW_COMPLETE" &&
            // <div className="mt-4">
            //     <button className="btn btn-primary btn-sm" onClick={handleOpen}>Explore More</button>
            // </div>
           

            <div className="mt-4">
                

                <button className="btn btn-primary btn-sm" onClick={(e)=>{
                    handleClick(data.id)
                }}>Add Your Review</button>
                
            </div>}
        </div>
            
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
            <Card>
                <CardMedia
                component="img"
                height="200"
                image={data.thumbnailUrl}
                alt="training video image"
                />
                <CardContent>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' , justifyContent: 'space-between', gap: 2 }}>
                        <Typography gutterBottom variant="h5" component="div">
                            {data.title}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CircularProgress
                            determinate
                            value={(data.trainingRating * 100) / 10}
                            sx={{ '--CircularProgress-size': '50px', color: 'gray' }}
                            >
                            {data.trainingRating} / 10
                            </CircularProgress>
                        </Box>
                    </Box>
                    
                    <div 
                        dangerouslySetInnerHTML={{ __html: cleanedData}}
                    />
                </CardContent>
            </Card>
                
            </Box>
            </Modal>
    </div>
    </div> 
        <div
            style={{
                width: '330px',
                borderRadius: '16px',
                paddingBottom: '16px',
                
            }}
        >

        </div>
            {/* Video dialoug modal */}
            {data.reviewStatus === "REVIEW_COMPLETE" ? (
            <VideoModal 
                toggleModal={toggleModal}
                isOpen={isDialogOpen}
                videoPlayer={videoPlayer}
                title={data.title}
                description={cleanedData}
                data= {data}
            />
            ) : (
            <NoContentVideoModal 
                toggleModal={toggleModal}
                isOpen={isDialogOpen}
                videoUrl={data?.videoUrl}
            />
            )}
        </div>
    </>
    )
}
    

export default RevVideoCard;