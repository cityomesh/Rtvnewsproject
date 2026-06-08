import React, { FC } from 'react';
import { StatisticsWidget7 } from '../../../../_metronic/partials/widgets';
import useSWR from 'swr';
import client,{ fetcher } from '../../service/network';
import { CourseData } from "../../../pages/academy/AllAcademy";
import { KTIcon } from "../../../../_metronic/helpers";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type CourseCardProps = {
    course: CourseData,
    fet: (page: number) => Promise<void>,
    onClick: ()=>void
}

const TotalMediumCoursesStat: FC<CourseCardProps> = ({course, fet,  onClick}) => {
    const {data: lessonData, error: lessonError, isValidating } = useSWR(`/course/${course.id}/lessons`, fetcher)
    const navigate = useNavigate()

    // if (error) {
    //     return <div>Error loading data</div>;
    // }

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

    return (
        <div className='col-xl-3 bg-light' style={{ border: '2px solid rgba(206, 206, 206, 1)', borderRadius: '12px'}}>
            <StatisticsWidget7
                href={`/course/${course.id}/lessons`} // Adjust href as needed
                className='card-xl-stretch'
                color='success'
                
                title={course.level}
                // description={lessonData?.length>0 && lessonData[0].title}
                description='Number Of Lessons'
                change={`${course?.noOfLesson || 0}`} // Use optional chaining to safely access nested properties
            />
            {/* {isValidating && <div>Loading...</div>} Optional: Show a loading indicator */}

            <div className="d-flex gap-4 justify-content-center" style={{ marginBottom: '15px', marginRight: '8%'}}>
        
            <a
            onClick={()=>{
                navigate(`/course/create/${course.id}`);
            }}
            className="btn btn-bg-light btn-color-danger p-1 btn-icon btn-outline me-1"
            style={{backgroundColor: '#FFFFFF00', width: '35px', height: '35px'}}
            >
                <KTIcon iconName='pencil' className="fs-4 text-primary" />
            </a>
            <a
            onClick={()=>{handleDelete(course.id)}}
            className="btn btn-bg-light btn-color-danger p-1 btn-icon btn-outline"
            style={{backgroundColor: '#FFFFFF00', width: '35px', height: '35px'}}
            >
                <KTIcon iconName='trash' className="fs-1 text-danger" />
            </a>
            </div> 
                </div>
            );
};

export default TotalMediumCoursesStat;
