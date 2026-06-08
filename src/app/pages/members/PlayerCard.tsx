/* eslint-disable @typescript-eslint/prefer-as-const */
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import { Modal as MuiModal,Box,CardMedia, CardActions } from '@mui/material';
import { KTIcon } from "../../../_metronic/helpers";
import moment from 'moment';
import  {Modal}  from "../../../_metronic/partials/widgets/modal/Modal";

import client from "../../modules/service/network";
import { toast } from "react-toastify";
import { useState } from "react";
// import VideoModal from './VideoModal';
import './style.css';
import { mutate } from "swr";

interface PlayerCardProps {
    player: any
    pageIndex: number
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


const PlayerCard: React.FC<PlayerCardProps> = ({player, pageIndex})=>{
    
    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [id, setId] = useState("")
    const toggleDialog = ()=>{
        setIsDialogOpen(!isDialogOpen);
    }

    // const getSessionStorageValue = (key: string): string | null => {
    //     return sessionStorage.getItem('JSESSIONID');

    // };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [openModal, setOpenModal] = useState(false);
    const toggleModal = ()=>{
      setOpenModal(!openModal);
    }

    const handleDelete = async ()=> {
        try{
            
            const response = await client.delete(`/members/${id}`);

            if (response.status === 200) {
                toast.success("Delete successful");
                if(player?.memberType === 'SUPPORT_STAFF') {
                    await mutate(`/members?page=${pageIndex}&size=9&memberType=SUPPORT_STAFF`);
                }else {
                    await mutate(`/members?page=${pageIndex}&size=9&memberType=PLAYER`);
                }
                // window.location.reload()
            }
        }
        catch(err){
            console.log("Delete Error",err);
            toast.error("Failed to delete");
        }
      }  

      useEffect(() => {
        
    }, [])

    return (
        <>

        {openModal && <Modal 
          header="Delete Member?"
          isOpen={openModal}
          toggleDialog={toggleModal}
          action2={{event: toggleModal, label: 'Cancel'}}
          action1={{event: ()=>{handleDelete(); toggleModal();}, label: "Delete"}}
          title="Member"
        />}

    <div>
        <Card className='bg-light' sx={{ width: '100%', maxWidth: 400, margin: 'auto' }}>
        <CardMedia
            component="img"
            image={`${player.photo}?auto=format&fit=fill&w=400`}
            alt="Player"
            style={{ objectFit: 'cover', width: '100%', height: '250px' }}
        />
        <CardContent>
        
        </CardContent>

        <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div className="text-light">
                {/* <Typography level="title-lg" sx={{ fontWeight: 'bold', color:'white' }}> */}
                <p className="text-gray-900">
                    {player.name} | {player.position}
                </p>
                {/* </Typography> */}
                {/* <Typography sx={{ mt: 1 }}>
                    {player.designation} | {`${player.age} Yrs`}
                </Typography> */}
                <p className="text-gray-900">
                    {player.designation} | {`${player.age} Yrs`}
                </p>
                <p className="text-gray-900 mt-1 cursor-pointer" onClick={handleOpen}>
                    {"Read More"}
                </p>
                {/* <Typography
                    sx={{ mt: 1, cursor: 'pointer' }}
                    onClick={handleOpen}
                >
                    {"Read More"}
                </Typography> */}
            </div>

            <div className="d-flex flex-row justify-content-end align-items-center mb-2">
                <a
                    onClick={() => {
                        player?.memberType !== 'SUPPORT_STAFF' 
                            ? navigate(`/player/${player.id}`) 
                            : navigate(`/supportstaff/${player.id}`);
                    }}
                    className="btn btn-bg-light btn-color-danger p-1 btn-icon btn-outline me-4"
                    style={{ backgroundColor: '#FFFFFF00', cursor: "pointer" }}
                >
                    <KTIcon iconName='pencil' className="fs-2 text-primary" />
                </a>
                <a
                    onClick={() => {
                        setId(player.id);
                        toggleModal();
                    }}
                    className="btn btn-bg-light btn-color-danger p-1 btn-icon btn-outline"
                    style={{ backgroundColor: '#FFFFFF00', cursor: "pointer" }}
                >
                    <KTIcon iconName='trash' className="fs-2 text-danger" />
                </a>
            </div>
            
        </CardContent>
        {/* </Card> */}


        <MuiModal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            
            >
            <Box sx={style} style={{height: "500px", overflow: "scroll", width: "400px"}}>
            <Card>
                <CardMedia
                component="img"
                height="200"
                image={player.photo} 
                alt="training video image"
                style={{objectFit: "fill"}}
                />
                <CardContent>
                    <Typography gutterBottom component="div">
                        OverView
                    </Typography>


                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{ fontWeight: 'bold' }}>Name:</Typography>
                        <Typography>{player.name}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{ fontWeight: 'bold' }}>Age:</Typography>
                        <Typography>{player.age} | DOB: {moment(player.dob).format('Do MMM YYYY')}</Typography>
                    </Box>

                    {player?.memberType !== 'SUPPORT_STAFF' && <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{ fontWeight: 'bold' }}>Jersey Number:</Typography>
                        <Typography>{player.jerseyNumber}</Typography>
                    </Box>}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography  sx={{ fontWeight: 'bold' }}>Height:</Typography>
                        <Typography >{player.height}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography  sx={{ fontWeight: 'bold' }}>Position:</Typography>
                        <Typography >{player.position}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography  sx={{ fontWeight: 'bold' }}>City:</Typography>
                        <Typography >{player.city}</Typography>
                    </Box>

                    {player?.memberType !== 'SUPPORT_STAFF' && <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography  sx={{ fontWeight: 'bold' }}>Country:</Typography>
                        <Typography >{player.country}</Typography>
                    </Box>}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography  sx={{ fontWeight: 'bold' }}>Member Type:</Typography>
                        <Typography >{player.memberType}</Typography>
                    </Box>

                    {player?.memberType !== 'SUPPORT_STAFF' && <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography  sx={{ fontWeight: 'bold' }}>Total Matches:</Typography>
                        <Typography>{player.totalMatches}</Typography>
                    </Box>}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>

                        <Typography  sx={{ fontWeight: 'bold' }}>Social Media Id:</Typography>
                        <Typography >{player.socialMediaId}</Typography>
                    </Box>

                    {/* {player?.memberType === 'SUPPORT_STAFF' && <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography  sx={{ fontWeight: 'bold' }}>Staff Type:</Typography>
                        <Typography >{player.staffType}</Typography>
                    </Box>} */}
                    {/* <Typography variant="body2" color="text.secondary"> */}
                        
                    {/* </Typography>  */}
                </CardContent>
            </Card>
                
            </Box>
            </MuiModal>
            </Card>
        
    </div>

{/* <div className="card-container">
    <div className="card-image" style={{ height: '100%'}}>
        <img src={player.photo} alt={"player image"} className="card-img" height="100%" style={{borderRadius: "8px 8px 0px 0px"}}/>
        {!isDialogOpen && <div onClick={toggleModal} style={{ position: 'absolute',top: '33%',
            left: '40%',
            fontSize: '2rem',color: 'white', cursor: "pointer"}}>
            <PlayCircleOutlineIcon sx={{ fontSize: 60 }} />
        
        </div>}
      <div className="card-content d-flex justify-content-center">
            
            <div className="">
                <h5 className="card-title">{player.name}</h5>
            </div> */}
            {/* <div
                onClick={()=>{
                    const reelId = player._links.self.href.split("/").pop();
                    console.log(reelId)
                    navigate(`/reels/create/${reelId}`);}}
                    className="edit-delete-icon" style={{ left: '30%' }}>
                    <EditOutlinedIcon sx={{ fontSize: 40 }} />
            </div> */}
            {/* <div onClick={()=>{handleDelete(player._links.self.href.split("/").pop())}} className="edit-delete-icon" style={{  right: '30%', color: 'red' }}>
                    <DeleteForeverOutlinedIcon sx={{ fontSize: 40 }} />
            </div> */}

            
      {/* </div>
    </div>

            
        <div
            style={{
                width: '330px',
                borderRadius: '16px',
                paddingBottom: '16px',
                
            }}
        >

        </div> */}
            {/* <VideoModal 
            toggleModal={toggleModal}
            isOpen={isDialogOpen}
            // onClose={isDialogOpen}
            videoSrc={reel?.videoURL}/> */}
            
            
        {/* {/* </div> */}
    </>
    )
}
    

export default PlayerCard;