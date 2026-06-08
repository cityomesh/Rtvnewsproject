import { FC, useEffect, useState } from "react";
import { Label } from "../../common/design/typography/Label";
import { Semibold } from "../../common/design/typography/Semibold";
import { CourseData } from "./AllAcademy";
import useSWR, { mutate } from "swr";
import client, { fetcher } from "../../modules/service/network";
import { BodyLarge } from "../../common/design/typography/BodyLarge";
import { IoPlayCircleOutline } from "react-icons/io5";
import { KTIcon } from "../../../_metronic/helpers";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import LessonCard from "./LessonCard";
import { MultipleDeleteModal } from "../../../_metronic/partials/widgets/modal/MultipleDeleteModal";


import Shimmer from "../../common/shimmer/Shimmer";
import NoData from "../../common/nodata/NoData";
import { enqueueSnackbar } from "notistack";

type Lesson = {
    id: string,
    courseId: string,
    level: string,
    title: string,
    videoUrl: string,
    thumbnailUrl: string,
    description: string,
    quizId: string,
    watched: boolean
}

const Lessons = ()=>{
    const {id} = useParams();
    const [loader, setLoader] = useState<boolean>(true);
    const {data: lessonData, error: lessonError} = useSWR(`/course/${id}/lessons`, fetcher)
    const navigate = useNavigate()
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showSelect, setShowSelect] = useState<boolean>(false)

    const [openMultipleDeleteModal, setMultipleDeleteModal] = useState(false);
    const toggleMultipleDeleteModal = ()=>{
      setMultipleDeleteModal(!openMultipleDeleteModal);
}
    const toggleModal = ()=>{
        setIsDialogOpen(!isDialogOpen);
    }
    console.log("what comes in lesson tag", lessonData)
    
    const handleDelete = async (lessonid: string, courseid: string)=> {
        try{
            const response = await client.delete(`/course/${courseid}/lessons/${lessonid}`);
            toast.success("Delete successful");
            await mutate(`/course/${id}/lessons`)
            
        }
        catch(err){
            console.log(err);
            toast.error("Failed to delete");
        }
    }

    const handleSelect = (id: string) => {
        setSelectedIds(prevSelectedIds => {
          const updatedSelectedIds = new Set(prevSelectedIds);
          if (updatedSelectedIds.has(id)) {
            updatedSelectedIds.delete(id);
          } else {
            updatedSelectedIds.add(id);
          }
          return updatedSelectedIds;
        });

      };

      // Delete selected items via API
   const deleteSelectedItems = async () => {
    if (selectedIds.size === 0) return;

    try {
        const response = await client.delete(`/course/${id}/lesson/delete`, {
            headers: { 'Content-Type': 'application/json' },
            data: { lessonIds: Array.from(selectedIds) }
        });
        console.log('Deleting items with IDs:', Array.from(selectedIds));
        if (response.status === 200) {
            // lessonData(prevItems => prevItems.filter((item) => !selectedIds.has(item.id)));
            setSelectedIds(new Set());
            enqueueSnackbar("Selected items deleted successfully", { variant: "success" });
            mutate(`/course/${id}/lessons`);
            // window.location.reload();
        } else {
            throw new Error('Failed to delete selected items');
            setSelectedIds(new Set())
        }
      } catch (error) {
            console.error('Error deleting selected items:', error);
            enqueueSnackbar('Failed to delete selected items', { variant: "error" });
            setSelectedIds(new Set())
      }
    };

    const handleSubmit = () => {
      console.log("handle delete")
      // event.preventDefault();
      deleteSelectedItems();
      setShowSelect(!showSelect)
      toggleMultipleDeleteModal()
    };


    useEffect(() => {
        if(lessonData) {
            setLoader(false)
        }
    }, [lessonData])


    return (<>
    <PageTitle>    
        Lessons
    </PageTitle>

          {openMultipleDeleteModal && <MultipleDeleteModal
            header="Delete Lessons?"
            isOpen={openMultipleDeleteModal}
            toggleDialog={toggleMultipleDeleteModal}
            action2={{event: toggleMultipleDeleteModal, label: 'Cancel'}}
            // action1={{event: handleSubmit, label: "Delete"}}
            action1={{event: handleSubmit, label: "Delete"}}
            title="Selected Lessons"
          />}
    
    {loader ? <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
                <Shimmer />
            </div>:
            lessonData.length >= 1 ? (
                <>
                <div className="mb-8 d-flex">
                  {showSelect ? (
                    <>
                  <button
                    type="button"
                    onClick={toggleMultipleDeleteModal} // Add onClick to trigger deletion
                    disabled={selectedIds.size === 0}
                    className="btn btn-warning btn-sm mx-6"
                  >
                      {/* Delete {selectedIds.size > 1 && ({selectedIds.size >= 1 && selectedIds.size} {selectedIds.size > 1 ? "Reels ": "Reel "})} */}
                      Delete {selectedIds.size > 0 && (
                        <>
                          ({selectedIds.size} {selectedIds.size > 1 ? "Lessons" : "Lesson"})
                        </>
                      )}
                  </button>
                  <button 
                    type="button"
                    onClick={()=>setShowSelect(!showSelect)}
                    className="btn btn-primary btn-sm mx-1">
                      Cancel
                  </button>
                  </>
                  ) : (<>
                    <button
                      type="button"
                      onClick={()=>setShowSelect(!showSelect)} // Add onClick to trigger deletion

                      className="btn btn-warning btn-sm"
                    >
                      Select
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(-1)} // Add onClick to trigger deletion

                        className="btn btn-primary btn-sm mx-6"
                        >
                        Back
                    </button>
                    </>
                  )}
                  
              </div>

            <div className='row g-6 g-xl-9 mb-6 mb-xl-9'>
            {lessonData && lessonData.map((lesson:any, index:number) => (
                <div className="col-12 col-sm-6 col-md-4 col-xl-4" key={lesson?.id}>
                <div className="d-flex align-items-start">
                  {showSelect && (
                    <input
                      type="checkbox"
                      checked={selectedIds.has(lesson?.id)}
                      onChange={() => handleSelect(lesson?.id)}
                      className="me-2"
                    />
                  )}
                  <div className="w-100"> {/* Wrapper to maintain full width */}
                    <LessonCard lesson={lesson}
                    // pageIndex={pageIndex}
                    />
                  </div>
                  </div>
                </div>
                    
                ))}
            </div>
            </>) : <div className=''><NoData title={"Lesson"} createUrl={"/lessons/create"}/></div>}


    
    </>)
}

export default Lessons;