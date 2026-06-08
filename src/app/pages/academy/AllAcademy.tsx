import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material/";
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import client, { fetcher } from "../../modules/service/network";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import CourseCard from "./CourseCard";
import Lessons from "./Lessons";
import TotalMediumCoursesStat from "../../modules/widgets/components/TotalMediumCoursesStat";

export interface CourseData {
    id: string,
    level: string,
    noOfLesson: number,
    _links: any
  }

const AllAcademy: React.FC = () => {
  
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseData[] | null>(null);
  const [currentCourse, setCurrentCourse] = useState<CourseData | null>(null);
  const fetch = async (page: number) => {
    try {
      const response = await client.get(`/course?page=${page}&size=20`);
      setCourse(response.data._embedded.course);
      
    } catch (error: any) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetch(0);
  }, []);

  console.log("course", course?.length);
 
  return (
    <>
        <PageTitle>
            Courses
        </PageTitle>
        <div className="row gap-3 pb-12">
        {course && course.map((element, index)=>{
            return  <TotalMediumCoursesStat course={element} key={element.id} fet={fetch} onClick={()=>{navigate(`/course/${element.id}/lessons`)}}/>
            })    
        }

        
        </div>
       
    </>
  );
};

export { AllAcademy };