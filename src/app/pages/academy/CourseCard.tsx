import { FC, useState } from "react";
import { Label } from "../../common/design/typography/Label";
import { Semibold } from "../../common/design/typography/Semibold";
import { CourseData } from "./AllAcademy";
import useSWR, { mutate } from "swr";
import client, { fetcher } from "../../modules/service/network";
import { BodyLarge } from "../../common/design/typography/BodyLarge";
import { IoPlayCircleOutline } from "react-icons/io5";
import { KTIcon } from "../../../_metronic/helpers";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../../_metronic/partials/widgets/modal/Modal";

type CourseCardProps = {
    course: CourseData,
    fet: (page: number) => Promise<void>,
    onClick: ()=>void
}

const CourseCard: FC<CourseCardProps> = ({course, fet,  onClick})=>{
    const {data: lessonData, error: lessonError} = useSWR(`/course/${course.id}/lessons`, fetcher)
    const navigate = useNavigate();
    const [id, setId] = useState("");
    
    const handleDelete = async (id: string)=> {
        try{
            const response = await client.delete(`/course/${id}`);
            toast.success("Delete successful");
            await fet(0);
        }
        catch(err){
            console.log(err);
            toast.error("Failed to delete");
        }
    }

    const [openModal, setOpenModal] = useState(false);
    const toggleModal = ()=>{
      setOpenModal(!openModal);
    }

    
    return (<>

    {openModal && <Modal 
          header="Delete Course?"
          isOpen={openModal}
          toggleDialog={toggleModal}
          action2={{event: toggleModal, label: 'Cancel'}}
          action1={{event: ()=>{handleDelete(id); toggleModal();}, label: "Delete"}}
          title="Course"
    />}

    <div 
        className="bg-black px-6 py-2 rounded"
        onClick={()=>{}}
        style={{
            width: '352px',
            cursor: 'pointer'
        }}
    >
    <Semibold>
        {course.level}
    </Semibold>
    {<div
            style={{
                backgroundImage: `url(${lessonData?.length>0 ? lessonData[0].thumbnailUrl: 'https://picsum.photos/310'})`,
                backgroundSize: 'cover',
                width: '310px',
                height: '200px',
                margin: '12px 0 12px 0',
                borderRadius: '12px',
                position: 'relative'
            }}
            onClick={onClick}
        >
            <div style={{
                width: '310px',
                height: '200px',
                background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6))',
                position: 'relative',
            }}>
                <div className="position-relative d-flex justify-content-between" 
                    style={{
                        top: '65%',
                        left: '5%',
                    }}
                >
                <BodyLarge>
                {lessonData?.length>0 && lessonData[0].title}
                </BodyLarge>
                <IoPlayCircleOutline style={{color: "white", fontSize: 30, margin: '10px 40px 0 0'}}/>
                </div>
            </div>
        </div>} 
    <div className="d-flex gap-4">
        <div className="d-flex flex-column justify-content-center">
        <Label>
        {course.noOfLesson} lessons
        </Label>
        </div>
    
    <a
    onClick={()=>{
        toggleModal();
        setId(course.id)
    }}
    className="btn btn-bg-light btn-color-danger p-1 btn-icon btn-outline"
    style={{backgroundColor: '#FFFFFF00'}}
    >
        <KTIcon iconName='trash' className="fs-2 text-danger" />
    </a>
    <a
    onClick={()=>{
        navigate(`/course/create/${course.id}`);
    }}
    className="btn btn-bg-light btn-color-danger p-1 btn-icon btn-outline me-1"
    style={{backgroundColor: '#FFFFFF00'}}
    >
        <KTIcon iconName='pencil' className="fs-2 text-primary" />
    </a>
    </div>      
    </div>
    </>)
}

export default CourseCard;