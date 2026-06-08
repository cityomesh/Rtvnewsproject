/* eslint-disable @typescript-eslint/prefer-as-const */
import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material/";
import { KTIcon, toAbsoluteUrl } from "../../../_metronic/helpers";
import client from "../../modules/service/network";

// import { Modal } from "../../../_metronic/partials/widgets/modal/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Shimmer from "../../common/shimmer/Shimmer.tsx";
import NoData from "../../common/nodata/NoData.tsx";
import { Modal as MuiModal,Box,CardMedia, CardActions } from '@mui/material';
import CardContent from '@mui/joy/CardContent';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import Pagination from "../../common/pagination/Pagination.tsx";
import { MultipleDeleteModal } from "../../../_metronic/partials/widgets/modal/MultipleDeleteModal.tsx";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const AllUpdates: React.FC = () => {
  interface UpdateData {
    page: any;
    _embedded: any;
    _links: any;
  }

  const findDateTime = (timestamp: string): [string, string] => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return [formattedDate, formattedTime];
  };
  const navigate = useNavigate();
  const [updateElement, setUpdateElement] = useState<any[] | null>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loader, setLoader] = useState<boolean>(true);
  const updatesPerPage = 12;
  const [show, setShow] = useState(false);
  const [id, setId] = useState("");
  const [updatedId, setUpdatedId] = useState("");
  const [selectedUpdates, setSelectedUpdates] = useState<any | null>(null);
  const [queryParams, setQueryParams] = useState({ page: 0, size: 9 });
  const [openModal, setOpenModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showSelect, setShowSelect] = useState<boolean>(false)
  
  const notify = (message: any) => toast.error(message);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleReadMoreClick = (updates: any) => {
    setSelectedUpdates(updates); // Set the selected news item
    setIsDialogOpen(true);
  };

  const toggleModal = ()=>{
    setOpenModal(!openModal);
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const fetch = async (page: number) => {
    try {
      const response = await client.get(`/update`, {
        params: { ...queryParams, page },
      });
      setUpdateElement(response.data);
      setLoading(false);
      setLoader(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetch(queryParams.page);
  }, [queryParams.page]);

const [openMultipleDeleteModal, setMultipleDeleteModal] = useState(false);
const toggleMultipleDeleteModal = ()=>{
    setMultipleDeleteModal(!openMultipleDeleteModal);
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

const deleteSelectedItems = async () => {
  if (selectedIds.size === 0) return;

  try {
      const response = await client.delete(`/update/delete`, {
        data: { updateIds: Array.from(selectedIds) }
      });

      if (response.status === 200) {
        setUpdateElement((prevPosts) => prevPosts ? prevPosts.filter((item) => !selectedIds.has(item.id)) : null);
        setSelectedIds(new Set());
        toast.success("Selected items deleted successfully");
        fetch(queryParams.page);
      } else {
        throw new Error("Failed to delete selected items");
        setSelectedIds(new Set())
      }
    } catch (error) {
      console.error("Error deleting selected items:", error);
      toast.error("Error deleting selected items");
      setSelectedIds(new Set())
    }
  };

  const handleSubmit = () => {
    deleteSelectedItems();
    setShowSelect(!showSelect)
    toggleMultipleDeleteModal()
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDeleteAndClose = (idToDelete: any) => {
    client
      .delete(`update/${idToDelete}`)
      .then((response) => {
        toast.success("Update deleted successfully!");
        fetch(queryParams.page);
      })
      .catch((error) => {
        console.error("Error deleting updates", error);
      })
      .finally(() => {
        handleClose();
      });
  };

  const handleCreateForm = async (update: any, id: string) => {
    const newId = update.id;
    await setUpdatedId(newId);
    navigate(`/updates/create/${newId}`);
  };
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  function decrement() {
    if (queryParams.page > 0) {
      setQueryParams((prevParams) => ({
        ...prevParams,
        page: prevParams.page - 1,
      }));
    }
  }
  
  function increment() {
    // if (queryParams.page < updateElement?.page.totalPages) {
      setQueryParams((prevParams) => ({
        ...prevParams,
        page: prevParams.page + 1,
      }));
    // }
  }

  const truncateContent = (content: string, limit: number): string => {
    return content.length > limit ? content.slice(0, limit) + "..." : content;
  };


  return (
    <>

        <MuiModal
          open={isDialogOpen}
          onClose={handleCloseDialog}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          
          >
          <Box sx={style} style={{height: "400px", overflow: "scroll", width: "400px"}}>
            <a
              href={selectedUpdates?.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              
            >
              <Card>
                  <CardMedia
                  component="img"
                  height="200"
                  image={toAbsoluteUrl("media/icons/football_icon.svg")} 
                  alt="image"
                  style={{objectFit: "fill", border: 'none'
                  }}
                  />
                <CardContent sx={{ marginTop: '20px' }}>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
                      <Typography sx={{ fontSize: '18px', fontWeight: '700' }}>{selectedUpdates?.title}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography sx={{ fontSize: '12px', color: 'rgba(78,76,88,1) !important' }}>{findDateTime(selectedUpdates?.updatedAt)[0]} | {findDateTime(selectedUpdates?.updatedAt)[1]}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      {/* <Typography >{selectedUpdates?.description}</Typography> */}
                      <div 
                              dangerouslySetInnerHTML={{ __html: selectedUpdates?.description }}
                          />
                  </Box>

                    
                    {/* </Typography>  */}
                </CardContent>
              </Card>
            </a>
                
            </Box>
            </MuiModal>

          <>
          {/* {openModal && <Modal 
            header="Delete Update?"
            isOpen={openModal}
            toggleDialog={toggleModal}
            action2={{event: toggleModal, label: 'Cancel'}}
            action1={{event: ()=>{handleDeleteAndClose(id); toggleModal();}, label: "Delete"}}
            title="Update"
          />} */}

          {openMultipleDeleteModal && <MultipleDeleteModal
              header="Delete Updates?"
              isOpen={openMultipleDeleteModal}
              toggleDialog={toggleMultipleDeleteModal}
              action2={{event: toggleMultipleDeleteModal, label: 'Cancel'}}
              // action1={{event: handleSubmit, label: "Delete"}}
              action1={{event: handleSubmit, label: "Delete"}}
              title="Updates"
            />} 
            </>
          {loader ? <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
                <Shimmer />
            </div>: 
            updateElement && updateElement?.length>0 ?
            <div className="row">
            {updateElement && <div className="mb-8 d-flex">
              {showSelect ? <><button
                  type="button"
                  onClick={toggleMultipleDeleteModal} // Add onClick to trigger deletion
                  disabled={selectedIds.size === 0}
                  className="btn btn-warning btn-sm mx-6"
                >
                    Delete {selectedIds.size > 0 && (
                        <>
                          ({selectedIds.size} {selectedIds.size > 1 ? " Updates" : " Update"})
                        </>
                    )}
                </button>
                  <button 
                  type="button"
                  onClick={() => {
                    setShowSelect(!showSelect);
                    setSelectedIds(new Set());
                  }}
                  className="btn btn-primary btn-sm">
                    Cancel
                  </button>
                </>
                : <button
                  type="button"
                  onClick={()=>
                    setShowSelect(!showSelect)
                    // toggleModal()
                  } // Add onClick to trigger deletion

                  className="btn btn-warning btn-sm mx-1"
                >
                    Select
                </button>}
              </div>}

            {updateElement?.map((update: any) => (
          <div
            key={update.id}
            className="col-12 col-sm-6 col-md-4 col-xl-4 mb-5"
          >
            <div className="d-flex align-items-start">
            {showSelect && (<input
                            type="checkbox"
                            checked={selectedIds.has(update?.id)}
                            onChange={() => handleSelect(update?.id)}
                            className="me-2"
              />)}

            <div className="card w-100 px-6 cursor-pointer" style={{ display: 'flex', flexDirection: 'column' }}>
                <div onClick={() => handleReadMoreClick(update)}>
                  <div className="d-flex align-items-center flex-grow-1 mb-4 min-h-75px">
                    <div className="symbol symbol-45px me-5">
                      <img
                        src={toAbsoluteUrl("media/icons/football_icon.svg")}
                        alt=""
                      />
                    </div>


                    {/* Title and Date */}
                    <div className="d-flex flex-column mb-3">
                      <a href="#" className="text-gray-800 fs-6 fw-bold">
                        {update.title.length > 30
                              ? `${update.title.trim().slice(0, 20)}...`
                              : update.title}
                      </a>
                      <span className="text-gray-500 fw-semibold">
                        {findDateTime(update.updatedAt)[0]} | {findDateTime(update.updatedAt)[1]}
                      </span>
                    </div>
                  </div>
                  {/* Card content */}
                  <div className="">
                    <div className="over min-h-50px">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: update.description.trim().length > 60 
                          
                          ? `${update.description
                              .trim()
                              .slice(0, 60)}...<span style="color: blue; cursor: pointer;">
                              Read More</span>`
                          : update.description.trim(),
                        }}
                        className="text-gray-800 fw-normal mb-5 d-inline"
                        style={{
                          fontSize: "14px",
                          color: "#555",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          display: "-webkit-box",
                        }}
                      />
                        
                        {/* </p> */}
                        
                    </div>
                        
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-center mb-2 mt-3">
                  <a
                    href="#"
                    className="btn btn-sm btn-light btn-color-muted btn-active-light-success px-4 py-2 me-4"
                    onClick={async () => {
                      await handleCreateForm(update, id);
                    }}
                  >
                    <KTIcon iconName="pencil" className="fs-2 text-primary" />
                  </a>
                  <a
                    href="#"
                    className="btn btn-sm btn-light btn-color-muted btn-active-light-danger px-4 py-2"
                    onClick={() => {
                      toggleModal();
                      setId(update.id);
                      // setId(update._links.self.href.split("/").pop());
                    }}
                  >
                    <KTIcon iconName="trash" className="fs-2 text-danger" />
                  </a>
                </div>
                      {/* </a> */}
            </div>
          </div>
          </div>
        ))}
          </div> : <div className=''><NoData title={"update"} createUrl={"updates/create"}/></div>}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
        <button
          disabled={queryParams.page === 0 ? true : false}
          onClick={decrement}
          className='bg-light'
          style={{
            marginRight: "10px",
            width: "100px",
            height: "40px",
            borderRadius: "20px",
            // backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            border: "2px solid white",
            padding: "10px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          {" "}
          Previous
        </button>

        <button
          disabled={
            queryParams.page === (updateElement?.length || 0) - 1
              ? true
              : false
          }
          onClick={increment}
          className='bg-light'
          style={{
            marginLeft: "10px",
            width: "100px",
            height: "40px",
            borderRadius: "20px",
            // backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            border: "2px solid white",
            padding: "10px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          {" "}
          Next
        </button>
      </div>
            
    </>
  );
};

export { AllUpdates };
