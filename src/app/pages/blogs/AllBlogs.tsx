/* eslint-disable @typescript-eslint/prefer-as-const */
import React, { useState, useEffect, FormEvent } from "react";
import { CircularProgress } from "@mui/material/";
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import client from "../../modules/service/network";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { KTIcon } from "../../../_metronic/helpers";
import { Modal } from "../../../_metronic/partials/widgets/modal/Modal";
import Shimmer from "../../common/shimmer/Shimmer";
import NoData from "../../common/nodata/NoData";
import { Modal as MuiModal,Box,CardMedia, CardActions } from '@mui/material';
import CardContent from '@mui/joy/CardContent';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import { MultipleDeleteModal } from "../../../_metronic/partials/widgets/modal/MultipleDeleteModal";

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

const AllBlogs: React.FC = () => {
  interface BlogData {
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
  const [blogElement, setBlogElement] = useState<BlogData | null>(null);
  const [blogs, setBlogs] = useState<any[] | null>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [show, setShow] = useState(false);
  const [id, setId] = useState("");
  const notify = (message: any) => toast.error(message);

  const [blogId, setBlogId] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showSelect, setShowSelect] = useState<boolean>(false)
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null); 
  const [queryParams, setQueryParams] = useState({ page: 0, size: 9 });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleReadMoreClick = (blog: any) => {
    setSelectedBlog(blog); // Set the selected news item
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const fetch = async (page: number) => {
    try {
      const response = await client.get(`/blogs`, {
        params: { ...queryParams, page },
      });
      console.log(response.data);
      setBlogElement(response.data);
      const fetchedBlogs = response.data._embedded.blogs;
      setBlogs(fetchedBlogs.sort((a:any, b:any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
      console.log("sorted blog", blogs);
      // setBlogs(response.data._embedded.blogs)
      setLoading(false);
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

  const [openModal, setOpenModal] = useState(false);
  const toggleModal = ()=>{
      setOpenModal(!openModal);
}

const [openMultipleDeleteModal, setMultipleDeleteModal] = useState(false);
    const toggleMultipleDeleteModal = ()=>{
      setMultipleDeleteModal(!openMultipleDeleteModal);
}

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDeleteAndClose = (idToDelete: any) => {
    client
      .delete(`blogs/${idToDelete}`)
      .then((response) => {
        toast.success("Blog deleted successfully!");
        console.log("Blog deleted successfully");
        fetch(queryParams.page);
      })
      .catch((error) => {
        console.error("Error deleting blog:", error);
      })
      .finally(() => {
        // handleClose();
        toggleModal()
      });
  };

  const handleCreateForm = async (blog: any, id: string) => {
    const newId = blog._links.self.href.split("/").pop();
    await setBlogId(newId);
    // console.log(newId);
    navigate(`/blogs/create/${newId}`);
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
      console.log(queryParams.page);
    }
  }

  function increment() {
    if (queryParams.page < blogElement?.page.totalPages) {
      setQueryParams((prevParams) => ({
        ...prevParams,
        page: prevParams.page + 1,
      }));
      console.log(queryParams.page);
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

  const deleteSelectedItems = async () => {
    if (selectedIds.size === 0) return;

    try {
        const response = await client.delete(`/blog/delete`, {
          data: { blogIds: Array.from(selectedIds) }
        });

        if (response.status === 200) {
          setBlogs((prevPosts) => prevPosts ? prevPosts.filter((item) => !selectedIds.has(item.id)) : null);
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
      console.log("handle delete")
      // event.preventDefault();
      deleteSelectedItems();
      setShowSelect(!showSelect)
      toggleMultipleDeleteModal()
      };


  return (
    <>

          <MuiModal
            open={isDialogOpen}
            onClose={handleCloseDialog}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            
            >
            <Box sx={style} style={{height: "500px", overflow: "scroll", width: "400px"}}>
            <a
                        href={selectedBlog?.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        
                      >
            <Card>
                <CardMedia
                component="img"
                height="200"
                image={selectedBlog?.bannerImage}  
                alt="training video image"
                style={{objectFit: "fill"}}
                />
                <CardContent>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        
                        <Typography>{selectedBlog?.title}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        
                        <Typography>{findDateTime(selectedBlog?.updatedAt)[0]} | {findDateTime(selectedBlog?.updatedAt)[1]}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        
                        <Typography >{selectedBlog?.description}</Typography>
                    </Box>

                   
                    {/* </Typography>  */}
                </CardContent>
            </Card>
            </a>
                
            </Box>
            </MuiModal>

      {openModal && <Modal
        header="Delete Blog?"
        isOpen={openModal}
        toggleDialog={toggleModal}
        action2={{event: toggleModal, label: 'Cancel'}}
        action1={{event: ()=>{handleDeleteAndClose(id); toggleModal();}, label: "Delete"}}
        title="Blog"
      />}

          {openMultipleDeleteModal && <MultipleDeleteModal
            header="Delete Blogs?"
            isOpen={openMultipleDeleteModal}
            toggleDialog={toggleMultipleDeleteModal}
            action2={{event: toggleMultipleDeleteModal, label: 'Cancel'}}
            // action1={{event: handleSubmit, label: "Delete"}}
            action1={{event: handleSubmit, label: "Delete"}}
            title="Selected Blogs"
        />}

      {loading ? <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
                <Shimmer />
            </div> :
        blogs && blogs?.length>0 ?
        <div className="row">

          {blogs && blogs?.length>0 && <div className="mb-8 d-flex" style={{background: ''}}>
                {showSelect ? <><button
                  type="button"
                  onClick={toggleMultipleDeleteModal} // Add onClick to trigger deletion
                  disabled={selectedIds.size === 0}
                  className="btn btn-warning btn-sm mx-6"
                >
                    Delete {selectedIds.size > 0 && (
                        <>
                          ({selectedIds.size} {selectedIds.size > 1 ? "Blogs " : "Blog "})
                        </>
                    )}
                </button>
                  <button 
                  type="button"
                  onClick={()=>setShowSelect(!showSelect)}
                  className="btn btn-primary btn-sm">
                    Cancel
                  </button>
                </>
                : <button
                  type="button"
                  onClick={()=>
                    setShowSelect(!showSelect)
                  } // Add onClick to trigger deletion

                  className="btn btn-warning btn-sm mx-1"
                >
                    Select
                </button>}

            </div>}
        
        {blogs?.map((blog: any) => (
          <div
            key={blog._links.self.href.split("/").pop()}
            className="col-12 col-sm-6 col-md-4 col-xl-4 mb-5"
          >
            <div className="d-flex align-items-start">
            {showSelect && (<input
                            type="checkbox"
                            checked={selectedIds.has(blog._links.self.href.split("/").pop())}
                            onChange={() => handleSelect(blog._links.self.href.split("/").pop())}
                            className="me-2"
              />)}
            

            <div className="card w-100" style={{ display: 'flex', flexDirection: 'column' }}
                     onClick={() => handleReadMoreClick(blog)}
                    >
                      
                      <a
                        href="#"
                        target=""
                        rel="noopener noreferrer"
                        className="p-5 w-100"
                      >

                        {/* Title and Date */}
                        <div className="d-flex flex-column mb-3">
                          <a href="#" className="text-gray-800 fs-6 fw-bold">
                            {blog.title}
                          </a>
                          <span className="text-gray-500 fw-semibold">
                            {findDateTime(blog.updatedAt)[0]} | {findDateTime(blog.updatedAt)[1]}
                          </span>
                        </div>
                        {/* Card content */}
                        <div className="mb-5">
                          <div className="min-h-50px over">
                       
                          <p style={{
                                fontSize: "14px",
                                color: "#555",
                                margin: "0 0 15px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2, // Limits text to 2 lines
                                WebkitBoxOrient: "vertical",
                              }}
                              className="text-gray-800 fw-normal mb-5"><span 
                              
                              >{
                                blog.description.length > 100
                              ? `${blog.description.trim().slice(0, 70)} `
                              : blog.description}</span>
                              {blog.description.length > 70 && (
                              <span
                                onClick={() => handleReadMoreClick(blog)}
                                style={{color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                              >
                                ...Read More
                              </span>
                              )}
                              </p>
                              </div>
                          <div
                            className="bgi-no-repeat rounded min-h-250px mb-5"
                            style={{
                              backgroundImage: `url(${blog.bannerImage})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          ></div>
                          {/* </a> */}
                        </div>
                        <div className="d-flex align-items-center justify-content-center mb-2 mt-6">
                          <a
                            href="#"
                            className="btn btn-sm btn-light btn-color-muted btn-active-light-success px-4 py-2 me-4"
                            onClick={async () => {
                              await handleCreateForm(blog, id);
                            }}
                          >
                            <KTIcon iconName="pencil" className="fs-2 text-primary" />
                          </a>
                          <a
                            href="#"
                            className="btn btn-sm btn-light btn-color-muted btn-active-light-danger px-4 py-2"
                            onClick={() => {
                              toggleModal();
                              setId(blog._links.self.href.split("/").pop());
                            }}
                          >
                            <KTIcon iconName="trash" className="fs-2 text-danger" />
                          </a>
                        </div>
                      </a>
                  </div>
            </div>
          </div>
        ))}
      </div> :
      <div className=''><NoData title={"Blog"} createUrl={"/blogs/create"}/></div>}


      {blogElement?.page?.totalPages > 1 && <div
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
            queryParams.page === blogElement?.page.totalPages - 1 ? true : false
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
      </div>}
    </>
  );
};

export { AllBlogs };