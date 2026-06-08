/* eslint-disable @typescript-eslint/prefer-as-const */
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { KTIcon } from "../../../_metronic/helpers";
import useSWR, { mutate } from "swr";
import VideoModal from "../../common/modals/VideoModal";

import { Modal } from "../../../_metronic/partials/widgets/modal/Modal";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';


import client from "../../modules/service/network";
import { toast } from "react-toastify";
import { useState } from "react";
// import VideoModal from './VideoModal';
// import './style.css';

interface LessonCardProps {
    lesson: any
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


const LessonCard: React.FC<LessonCardProps> = ({lesson})=>{
    const {id} = useParams();
    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);

    const videoPlayer = (
      <video style={{ width: "100%", height: "100%" }} controls autoPlay>
        <source src={lesson?.videoURL} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
    const toggleDialog = ()=>{
        setIsDialogOpen(!isDialogOpen);
    }

    const [openModal, setOpenModal] = useState(false);
    const toggleModal = ()=>{
      setOpenModal(!openModal);
    }

    const handleClickOpen = (lessonid: string, courseid: string) => {
        setOpen(true);
        setItemToDelete(lessonid);
        setDeleteCourseId(courseid)
      };
    
      const handleClickClose = () => {
        setOpen(false);
        setItemToDelete(null);
        setDeleteCourseId(null)
      };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDelete = async ()=> {
        if (itemToDelete !== null) {
        try{
            const response = await client.delete(`/course/${deleteCourseId}/lessons/${itemToDelete}`);
            toast.success("Delete successful");
            await mutate(`/course/${id}/lessons`)
            
        }
        catch(err){
            console.log(err);
            toast.error("Failed to delete");
        }
    }
}

      useEffect(() => {
        
    }, [])

    return (
        <>

        {openModal && <Modal 
          header="Delete Lesson?"
          isOpen={openModal}
          toggleDialog={toggleModal}
          action2={{event: toggleModal, label: 'Cancel'}}
          action1={{event: ()=>{handleDelete(); toggleModal();}, label: "Delete"}}
          title="Lesson"
        />}


    

            <Card className='bg-light' sx={{position: 'relative'  }}>
                <CardHeader className="text-gray-900"
                    titleTypographyProps={{
                        fontSize: 18,
                        fontWeight: 500
                    }}
                    avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        {lesson.level === "Advanced" ? "A" : lesson.level === "Medium" ? "M" : "B"}
                    </Avatar>
                    }
                    
                    title={lesson.level}
                />
                
                    <CardMedia
                        component="img"
                        alt="Lesson Image"
                        height="200"
                        image={lesson.thumbnailUrl}
                        
                    />

                    
                    {!isDialogOpen && <div onClick={toggleDialog} style={{ position: 'absolute', top: '35%',
                            left: '40%',
                            fontSize: '2rem',color: 'white', cursor: "pointer"}}>
                            <PlayCircleOutlineIcon sx={{ fontSize: 60 }} />
                        
                    </div>}
                
                
                <CardContent className="text-gray-900">
                    <Typography gutterBottom variant="h6" component="div">
                        {lesson.title}
                    </Typography>
                </CardContent>
                <CardActions
                    sx={{display: "flex", justifyContent: "center"}}
                    >
                    <a
                        onClick={()=>{
                            handleClickOpen(lesson.id, lesson.courseId)
                            toggleModal();
                        }}
                        className="btn btn-bg-light btn-color-danger p-1 btn-icon btn-outline"
                        style={{backgroundColor: '#FFFFFF00', margin: '4px'}}
                        >
                        <KTIcon iconName='trash' className="fs-2 text-danger" />
                    </a>
                    <a
                        onClick={()=>{
                            navigate(`/lessons/create/${lesson.id}`)
                        }}
                        className="btn btn-bg-light btn-color-danger p-1 btn-icon btn-outline me-1"
                        style={{backgroundColor: '#FFFFFF00'}}
                        >
                            <KTIcon iconName='pencil' className="fs-2 text-primary" />
                    </a>
                </CardActions>
            </Card>

            <VideoModal 
            toggleModal={toggleDialog}
            isOpen={isDialogOpen}
            // onClose={isDialogOpen}
            videoPlayer={videoPlayer}
            title={lesson.title}
            description={lesson.description}
            data= {lesson}/>
            
            
        
    </>
    )
}
    

export default LessonCard;