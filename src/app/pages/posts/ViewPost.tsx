// import React, { useState, useEffect, FormEvent } from "react";
// import client, { fetcher } from "../../modules/service/network";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import { PageTitle } from "../../../_metronic/layout/core";
// import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, Stack, Typography } from "@mui/material";
// import { KTIcon } from "../../../_metronic/helpers";
// import { toast } from "react-toastify";
// import Shimmer from "../../common/shimmer/Shimmer";
// import Pagination from "../../common/pagination/Pagination";
// import { MultipleDeleteModal } from "../../../_metronic/partials/widgets/modal/MultipleDeleteModal";
// import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
// import VideoModal from "../../common/modals/VideoModal";
// import PostCard from "./PostCard";
// import { isAdmin, getCurrentUser } from "../../modules/auth/session.ts";

// export interface PostData {
//     id: string,
//     title: string,
//     description: string,
//     bannerImage: string | null,
//     video: {
//         externalFile: {
//             url: string | null,
//             type: string | null,
//         },
//         internalFile: {
//             video: string | null,
//             thumbnail: string | null,
//         }
//     },
//     insights: {
//         noOfComments: number,
//         noOfLikes: number,
//     },
//     createdAt: string,
//     updatedAt: string,
//     liked: boolean,
// }

// const PAGE_SIZE = 10;

// const ViewPost: React.FC = () => {
//   const navigate = useNavigate();
//   const [loader, setLoader] = useState<boolean>(true);
//   const [post, setPost] = useState<PostData[] | null>(null);
//   const [id, setId] = useState("");
//   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
//   const [showSelect, setShowSelect] = useState<boolean>(false)
//   const [pageIndex, setPageIndex] = useState(0)
//   const [totalPages, setTotalPages] = useState(0);
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
//   const [activeVideoPost, setActiveVideoPost] = useState<PostData | null>(null);
//   const [postCreators, setPostCreators] = useState<Record<string, string>>({});
  
//   const adminUser = isAdmin();
//   const currentUser = getCurrentUser();
//   const currentUsername = currentUser?.username || '';

//   useEffect(() => {
//     const stored = localStorage.getItem('post_creators');
//     if (stored) {
//       setPostCreators(JSON.parse(stored));
//     }
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedSearch(search), 500);
//     return () => clearTimeout(timer);
//   }, [search]);

//   const fetchPosts = async (page: number, query: string) => {
//     setLoader(true);
//     try {
//       const params: any = { page, size: PAGE_SIZE };
//       if (query.trim() !== "") params.query = query.trim();
//       const response = await client.get(`/post/dashboard/search`, { params });
//       setPost(response.data || []);
//       setPageIndex(page)
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to fetch posts");
//     } finally {
//       setLoader(false);
//     }
//   };

//   useEffect(() => {
//     fetchPosts(pageIndex, debouncedSearch);
//   }, [pageIndex, debouncedSearch]);

//   const handleVideoModal = (post: PostData | null) => {
//     setActiveVideoPost(post);
//   };

//   const [openModal, setOpenModal] = useState(false);
//   const toggleModal = ()=>{
//     setOpenModal(!openModal);
//   }

//   const [openMultipleDeleteModal, setMultipleDeleteModal] = useState(false);
//   const toggleMultipleDeleteModal = ()=>{
//     setMultipleDeleteModal(!openMultipleDeleteModal);
//   }

//   const handleDelete = async ()=> {
//     try{
//         console.log(id);
//         const response = await client.delete(`/posts/${id}`);
//         toast.success("Delete successful");
//         fetchPosts(pageIndex, debouncedSearch);
//     }
//     catch(err){
//         console.log(err);
//         toast.error("Failed to delete");
//     }
//   }

//   const handleSelect = (id: string) => {
//     setSelectedIds(prevSelectedIds => {
//       const updatedSelectedIds = new Set(prevSelectedIds);
//       if (updatedSelectedIds.has(id)) {
//         updatedSelectedIds.delete(id);
//       } else {
//         updatedSelectedIds.add(id);
//       }
//       return updatedSelectedIds;
//     });
//   };

//   // Delete selected items via API
//   const deleteSelectedItems = async () => {
//     if (selectedIds.size === 0) return;

//     try {
//         const response = await client.delete(`/post/delete`, {
//           data: { postIds: Array.from(selectedIds) }
//         });

//         if (response.status === 200) {
//           setPost((prevPosts) => prevPosts ? prevPosts.filter((item) => !selectedIds.has(item.id)) : null);
//           setSelectedIds(new Set());
//           toast.success("Selected items deleted successfully");
//           fetchPosts(pageIndex, debouncedSearch);
//         } else {
//           throw new Error("Failed to delete selected items");
//           setSelectedIds(new Set())
//         }
//       } catch (error) {
//         console.error("Error deleting selected items:", error);
//         toast.error("Error deleting selected items");
//         setSelectedIds(new Set())
//       }
//     };

//     const handleSubmit = () => {
//         console.log("handle delete")
//         deleteSelectedItems();
//         setShowSelect(!showSelect)
//         toggleMultipleDeleteModal()
//     };
    
//     // Helper to determine if current user can edit a post
//     const canEdit = (postId: string): boolean => {
//       if (adminUser) return true;
//       const creator = postCreators[postId];
//       return creator === currentUsername;
//     };

//   return (
//     <>
//         <div className="mb-4 d-flex justify-content-between align-items-center">
//           <h2>Post</h2>
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search posts..."
//             value={search}
//             onChange={(e) => {
//               setPageIndex(0);
//               setSearch(e.target.value);
//             }}
//             style={{ width: "30%" }}
//           />
//         </div>

//         {openMultipleDeleteModal && <MultipleDeleteModal
//             header="Delete Posts?"
//             isOpen={openMultipleDeleteModal}
//             toggleDialog={toggleMultipleDeleteModal}
//             action2={{event: toggleMultipleDeleteModal, label: 'Cancel'}}
//             action1={{event: handleSubmit, label: "Delete"}}
//             title="Selected Posts"
//           />}

          
//           {loader ? (
//             <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
//                 <Shimmer />
//             </div>
//           ) : (
//             <>
//             <div className="row pb-12">
//             {post && post.map((element)=>(
//               <div key={element.id} className="col-12 col-sm-6 col-md-4 col-xl-4 d-flex align-items-start mb-6">
//                 {showSelect && (<input
//                     type="checkbox"
//                     checked={selectedIds.has(element?.id)}
//                     onChange={() => handleSelect(element?.id)}
//                     className="mx-4"
//                 />)}
//                 <div className="w-100">
//                     <PostCard 
//                       post={element}
//                       pageIndex={pageIndex}
//                       refreshData={() => fetchPosts(pageIndex, debouncedSearch)}
//                       showEdit={canEdit(element.id)}   // ✅ pass edit permission
//                     />
//                   </div> 
//               </div>
          
//         ))}

//         </div>
//        </>)}
//         <Pagination
//             pageIndex={pageIndex}
//             totalPages={totalPages}
//             onPrevious={() => setPageIndex(pageIndex - 1)}
//             onNext={() => setPageIndex(pageIndex + 1)}
//         />
//     </>
//   );
// };

// export { ViewPost };





import React, { useState, useEffect, FormEvent } from "react";
import client, { fetcher } from "../../modules/service/network";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, Stack, Typography } from "@mui/material";
import { KTIcon } from "../../../_metronic/helpers";
import { toast } from "react-toastify";
import Shimmer from "../../common/shimmer/Shimmer";
import Pagination from "../../common/pagination/Pagination";
import { MultipleDeleteModal } from "../../../_metronic/partials/widgets/modal/MultipleDeleteModal";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import VideoModal from "../../common/modals/VideoModal";
import PostCard from "./PostCard";
import { isAdmin, getCurrentUser } from "../../modules/auth/session.ts";
import { moveToTrash, isInTrash } from "../../modules/service/trashService";   // ✅ import trash service

export interface PostData {
    id: string,
    title: string,
    description: string,
    bannerImage: string | null,
    video: {
        externalFile: {
            url: string | null,
            type: string | null,
        },
        internalFile: {
            video: string | null,
            thumbnail: string | null,
        }
    },
    insights: {
        noOfComments: number,
        noOfLikes: number,
    },
    createdAt: string,
    updatedAt: string,
    liked: boolean,
}

const PAGE_SIZE = 10;

const ViewPost: React.FC = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState<boolean>(true);
  const [post, setPost] = useState<PostData[] | null>(null);
  const [id, setId] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showSelect, setShowSelect] = useState<boolean>(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [activeVideoPost, setActiveVideoPost] = useState<PostData | null>(null);
  const [postCreators, setPostCreators] = useState<Record<string, string>>({});
  
  const adminUser = isAdmin();
  const currentUser = getCurrentUser();
  const currentUsername = currentUser?.username || '';

  useEffect(() => {
    const stored = localStorage.getItem('post_creators');
    if (stored) {
      setPostCreators(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPosts = async (page: number, query: string) => {
    setLoader(true);
    try {
      const params: any = { page, size: PAGE_SIZE };
      if (query.trim() !== "") params.query = query.trim();
      const response = await client.get(`/post/dashboard/search`, { params });
      let postsData = response.data || [];
      
      // ✅ Filter out posts that are in trash
      postsData = postsData.filter((post: any) => !isInTrash(post.id, 'post'));
      
      setPost(postsData);
      setPageIndex(page)
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch posts");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchPosts(pageIndex, debouncedSearch);
  }, [pageIndex, debouncedSearch]);

  const handleVideoModal = (post: PostData | null) => {
    setActiveVideoPost(post);
  };

  const [openModal, setOpenModal] = useState(false);
  const toggleModal = ()=>{
    setOpenModal(!openModal);
  }

  const [openMultipleDeleteModal, setMultipleDeleteModal] = useState(false);
  const toggleMultipleDeleteModal = ()=>{
    setMultipleDeleteModal(!openMultipleDeleteModal);
  }

  // ❌ Remove old single delete (now handled in PostCard)
  // const handleDelete = async ()=> { ... }

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

  // ✅ Batch delete – move each to trash + API batch delete
  const deleteSelectedItems = async () => {
    if (selectedIds.size === 0) return;

    const currentUserObj = getCurrentUser();
    if (!currentUserObj) {
      toast.error("User not logged in");
      return;
    }

    // 1. Move each selected post to trash (localStorage)
    const postsToDelete = post?.filter(p => selectedIds.has(p.id)) || [];
    for (const postItem of postsToDelete) {
      moveToTrash({
        id: postItem.id,
        type: 'post',
        data: postItem,
      }, currentUserObj.username);
    }

    // 2. Call batch delete API
    try {
        const response = await client.delete(`/post/delete`, {
          data: { postIds: Array.from(selectedIds) }
        });

        if (response.status === 200) {
          setPost((prevPosts) => prevPosts ? prevPosts.filter((item) => !selectedIds.has(item.id)) : null);
          setSelectedIds(new Set());
          toast.success("Selected posts moved to trash and deleted from server!");
          fetchPosts(pageIndex, debouncedSearch);
        } else {
          throw new Error("Failed to delete selected items");
        }
      } catch (error) {
        console.error("Error deleting selected items:", error);
        toast.error("Error deleting selected items");
      }
    };

    const handleSubmit = () => {
        console.log("handle delete")
        deleteSelectedItems();
        setShowSelect(!showSelect)
        toggleMultipleDeleteModal()
    };
    
    // Helper to determine if current user can edit a post
    const canEdit = (postId: string): boolean => {
      if (adminUser) return true;
      const creator = postCreators[postId];
      return creator === currentUsername;
    };

  return (
    <>
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <h2>Post</h2>
          <input
            type="text"
            className="form-control"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => {
              setPageIndex(0);
              setSearch(e.target.value);
            }}
            style={{ width: "30%" }}
          />
        </div>

        {openMultipleDeleteModal && <MultipleDeleteModal
            header="Delete Posts?"
            isOpen={openMultipleDeleteModal}
            toggleDialog={toggleMultipleDeleteModal}
            action2={{event: toggleMultipleDeleteModal, label: 'Cancel'}}
            action1={{event: handleSubmit, label: "Delete"}}
            title="Selected Posts"
          />}

          
          {loader ? (
            <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
                <Shimmer />
            </div>
          ) : (
            <>
            <div className="row pb-12">
            {post && post.map((element)=>(
              <div key={element.id} className="col-12 col-sm-6 col-md-4 col-xl-4 d-flex align-items-start mb-6">
                {showSelect && (<input
                    type="checkbox"
                    checked={selectedIds.has(element?.id)}
                    onChange={() => handleSelect(element?.id)}
                    className="mx-4"
                />)}
                <div className="w-100">
                    <PostCard 
                      post={element}
                      pageIndex={pageIndex}
                      refreshData={() => fetchPosts(pageIndex, debouncedSearch)}
                      showEdit={canEdit(element.id)}
                    />
                  </div> 
              </div>
          
        ))}

        </div>
       </>)}
        <Pagination
            pageIndex={pageIndex}
            totalPages={totalPages}
            onPrevious={() => setPageIndex(pageIndex - 1)}
            onNext={() => setPageIndex(pageIndex + 1)}
        />
    </>
  );
};

export { ViewPost };
