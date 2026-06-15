// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { KTIcon } from "../../../_metronic/helpers";
// import { Modal } from "../../../_metronic/partials/widgets/modal/Modal";
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
// import { Stack, useMediaQuery, useTheme } from '@mui/material';
// import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
// import XIcon from '@mui/icons-material/X';
// import InstagramIcon from '@mui/icons-material/Instagram';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import YouTubeIcon from '@mui/icons-material/YouTube';
// import ImgNotFound from '../../../../public/media/image-not-found.png';
// import client from "../../modules/service/network";
// import { toast } from "react-toastify";
// import VideoModal from "../../common/modals/VideoModal";
// import { getInstagramEmbedUrl, getTwitterEmbedUrl, getYouTubeVideoId, containsFacebookUrl } from "../../../utils/GetYoutubeLink";
// import { isAdmin } from "../../modules/auth/session.ts";

// import MuiModal from '@mui/material/Modal';
// import Box from '@mui/material/Box';
// import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';

// export interface PostData {
//   post: any;
//   pageIndex: number;
//   refreshData: () => void;
//   showEdit?: boolean;   // edit permission (creator or admin)
// }

// const getYouTubeEmbedUrl = (url: string): string | null => {
//   const videoId = getYouTubeVideoId(url);
//   return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1` : null;
// };

// const getYouTubeThumbnail = (url: string): string | null => {
//   const videoId = getYouTubeVideoId(url);
//   return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
// };

// const stripHtml = (html: string) => {
//   const doc = new DOMParser().parseFromString(html || '', 'text/html');
//   return doc.body.textContent || "";
// };

// const getFirstNWords = (html: string, n: number) => {
//   const text = stripHtml(html);
//   return text.split(" ").slice(0, n).join(" ");
// };

// const PostCard: React.FC<PostData> = ({ post, pageIndex, refreshData, showEdit = true }) => {
//   const navigate = useNavigate();
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
//   const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
//   const adminUser = isAdmin();   // ✅ true if logged-in user is ADMIN

//   const toggleVideoModal = () => setIsVideoModalOpen(!isVideoModalOpen);
//   const toggleImageModal = () => setIsImageModalOpen(!isImageModalOpen);
//   const toggleDeleteModal = () => setDeleteModalOpen(!deleteModalOpen);

//   const handleDelete = async () => {
//     if (post?.id) {
//       try {
//         await client.delete(`/post/${post.id}`);
//         toast.success("Delete successful");
//         refreshData();
//       } catch (err) {
//         toast.error("Failed to delete");
//       }
//     }
//   };

//   const externalUrl = post?.video?.externalFile?.url || null;
//   const uploadedVideoUrl = post?.video?.internalFile?.video || null;
//   const uploadedVideoThumbnail = post?.video?.internalFile?.thumbnail || null;
//   const bannerImage = post?.bannerImage || null;

//   const isYouTube = !!externalUrl;
//   const isUploadedVideo = !!uploadedVideoUrl;
//   const isImage = !!bannerImage;
//   const hasVideo = isYouTube || isUploadedVideo;
//   let videoPlayer;
//   let videoIcon = <PlayCircleOutlineIcon sx={{ fontSize: 60 }} />;

//   let displayImage: string = "";

//   if (isYouTube) {
//     displayImage = getYouTubeThumbnail(externalUrl) || "";
//     let embedUrl = "";
//     let platform = "";

//     const youtubeId = getYouTubeVideoId(externalUrl);
//     const twitterEmbed = getTwitterEmbedUrl(externalUrl);
//     const instagramEmbed = getInstagramEmbedUrl(externalUrl);
//     const facebookEmbed = containsFacebookUrl(externalUrl);

//     if (youtubeId) {
//       embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
//       platform = "YouTube";
//       videoIcon = <YouTubeIcon sx={{ fontSize: 60 }} />;
//       console.log("YT ID", embedUrl);
//     } else if (twitterEmbed) {
//       embedUrl = twitterEmbed;
//       platform = "Twitter";
//       videoIcon = <XIcon sx={{ fontSize: 60 }} />;
//       console.log("TW", embedUrl);
//     } else if (instagramEmbed) {
//       embedUrl = instagramEmbed;
//       platform = "Instagram";
//       videoIcon = <InstagramIcon sx={{ fontSize: 60 }} />;
//       console.log("ING", embedUrl);
//     } else if (facebookEmbed) {
//       embedUrl = externalUrl;
//       platform = "Facebook";
//       videoIcon = <FacebookIcon sx={{ fontSize: 60 }} />;
//       console.log("FB", embedUrl);
//     }

//     if (embedUrl) {
//       if (platform === "YouTube") {
//         videoPlayer = (
//           <Box display={"flex"} justifyContent={"center"} alignItems={"center"} position={"relative"} maxWidth={450} width={"100%"} height={"100%"}>
//             <iframe
//               src={embedUrl}
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//               title="YouTube video player"
//               style={{
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//                 width: "100%",
//                 height: "100%",
//                 border: 0,
//               }}
//             />
//           </Box>
//         );
//       } else if (platform === "Twitter") {
//         videoPlayer = (
//           <div
//             style={{ display: "flex", justifyContent: "center", width: "100%", height: "100%" }}
//           >
//             <iframe
//               src={embedUrl}
//               // allowFullScreen
//               title="Twitter post"
//               style={{
//                 border: "none",
//                 maxWidth: "550px",
//                 width: "100%",
//                 minHeight: "500px",
//               }}
//             />
//           </div>
//         );
//       } else if (platform === "Instagram") {
//         videoPlayer = (
//           <div style={{ maxWidth: "400px", margin: "0 auto" }}>
//             <div
//               style={{
//                 position: "relative",
//                 paddingTop: "125%",
//                 width: "100%",
//                 overflow: "hidden",
//               }}
//             >
//               <iframe
//                 src={embedUrl}
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//                 title="Instagram post"
//                 style={{
//                   position: "absolute",
//                   top: 0,
//                   left: 0,
//                   width: "100%",
//                   height: "100%",
//                   border: 0,
//                   overflow: "hidden",
//                   display: "block",
//                 }}
//               />
//             </div>
//           </div>
//         );
//       } else if (platform === "Facebook") {
//         videoPlayer = (
//           <Box display={"flex"} justifyContent={"center"} alignItems={"center"} position={"relative"} maxWidth={450} width={"100%"} height={"100%"}>
//             <div
//               style={{
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//                 width: "100%",
//                 height: "100%",
//               }}
//               dangerouslySetInnerHTML={{
//                 __html: embedUrl
//                   .replace(/width="[^"]*"/, 'width="100%"')
//                   .replace(/height="[^"]*"/, 'height="100%"'),
//               }}
//             />
//           </Box>
//         );
//       }
//     } else {
//       videoPlayer = (
//         <Box p={isSmallScreen ? 1 : 2}>
//           <p>Could not load external video/post from: {externalUrl}</p>
//           <a href={externalUrl} target="_blank" rel="noopener noreferrer">
//             Open link in new tab
//           </a>
//         </Box>
//       );
//     }
//   } else if (isUploadedVideo) {
//     displayImage = uploadedVideoThumbnail || "";
//     videoPlayer = (
//       <video style={{ width: "100%", height: "100%" }} controls autoPlay>
//         <source src={uploadedVideoUrl} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//     );
//   } else if (isImage) {
//     displayImage = bannerImage;
//   }

//   const handleCardClick = () => {
//     if (hasVideo) {
//       toggleVideoModal();
//     } else if (isImage) {
//       toggleImageModal();
//     }
//   };

//   const modalStyle = {
//     position: 'absolute' as const,
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: '80%',
//     maxWidth: '800px',
//     maxHeight: '90vh',
//     bgcolor: 'background.paper',
//     boxShadow: 24,
//     p: 4,
//     borderRadius: 2,
//     overflowY: 'auto',
//   };

//   return (
//     <>
//       {/* Delete Confirmation Modal */}
//       <Modal
//         header="Delete Post?"
//         isOpen={deleteModalOpen}
//         toggleDialog={toggleDeleteModal}
//         action2={{ event: toggleDeleteModal, label: 'Cancel' }}
//         action1={{ event: () => { handleDelete(); toggleDeleteModal(); }, label: "Delete" }}
//         title="Are you sure you want to delete this post?"
//       />

//       {/* Video Player Modal */}
//       <VideoModal
//         toggleModal={toggleVideoModal}
//         isOpen={isVideoModalOpen}
//         videoPlayer={videoPlayer}
//         title={post?.title}
//         description={post?.description}
//         data={post}
//       />

//       {/* Image Modal */}
//       <MuiModal open={isImageModalOpen} onClose={toggleImageModal}>
//         <Box sx={modalStyle}>
//           <IconButton
//             onClick={toggleImageModal}
//             sx={{
//               position: 'absolute',
//               top: 8,
//               right: 8,
//               zIndex: 2,
//               backgroundColor: 'rgba(255, 255, 255, 0.7)',
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//           <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: 'auto' }}>
//             <Box sx={{ width: '100%', height: 'auto', maxHeight: '60vh', overflow: 'hidden' }}>
//               <img
//                 src={displayImage}
//                 alt={stripHtml(post?.title)}
//                 style={{
//                   width: '100%',
//                   height: 'auto',
//                   objectFit: 'contain',
//                 }}
//               />
//             </Box>
//             <Box sx={{ padding: 2, overflowY: 'auto', height: 'auto', marginTop: 2 }}>
//               <Typography variant="h5" gutterBottom dangerouslySetInnerHTML={{ __html: post?.title }} />
//               <Typography variant="body1" dangerouslySetInnerHTML={{ __html: post?.description }} />
//             </Box>
//           </Box>
//         </Box>
//       </MuiModal>

//       {/* Post Card */}
//       <Card
//         className='bg-light'
//         style={{ position: "relative", height: '100%', cursor: 'pointer' }}
//         onClick={handleCardClick}
//       >
//         <div style={{ position: 'relative' }}>
//           <CardMedia
//             component="img"
//             height="194"
//             image={displayImage || ImgNotFound}
//             alt="Post media"
//           />
//           {hasVideo && (
//             <div
//               style={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//                 color: 'white',
//                 pointerEvents: 'none',
//                 backgroundColor: 'rgba(0, 0, 0, 0.4)',
//                 borderRadius: '50%',
//                 padding: '8px'
//               }}
//             >
//               {videoIcon}
//             </div>
//           )}
//         </div>

//         <CardContent sx={{ paddingTop: 1, paddingBottom: 1 }}>
//           <Typography noWrap sx={{ fontSize: '15px', fontWeight: 'bold' }} title={stripHtml(post?.title)}>
//             {stripHtml(post?.title)}
//           </Typography>
//           <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
//             {getFirstNWords(post?.description, 20)}
//           </Typography>
//         </CardContent>

//         <CardActions disableSpacing sx={{ padding: '16px' }}>
//           <Stack gap={1}>
//             <Typography variant="caption">Comments: {post?.insights?.noOfComments || 0}</Typography>
//             <Typography variant="caption">Likes: {post?.insights?.noOfLikes || 0}</Typography>
//           </Stack>
//           <div className="d-flex gap-2" style={{ marginLeft: "auto" }}>
//             {/* ✅ Delete button shown only for admin users */}
//             {adminUser && (
//               <a
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleDeleteModal();
//                 }}
//                 className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
//               >
//                 <KTIcon iconName="trash" className="fs-3 text-danger" />
//               </a>
//             )}
//             {/* Edit button shown only if showEdit is true (creator or admin) */}
//             {showEdit && (
//               <a
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigate(`/post/create/${post?.id}`);
//                 }}
//                 className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
//               >
//                 <KTIcon iconName="pencil" className="fs-3 text-primary" />
//               </a>
//             )}
//           </div>
//         </CardActions>
//       </Card>
//     </>
//   );
// };

// export default PostCard;

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { KTIcon } from "../../../_metronic/helpers";
import { Modal } from "../../../_metronic/partials/widgets/modal/Modal";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Stack, useMediaQuery, useTheme } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ImgNotFound from '../../../../public/media/image-not-found.png';
import client from "../../modules/service/network";
import { toast } from "react-toastify";
import VideoModal from "../../common/modals/VideoModal";
import { getInstagramEmbedUrl, getTwitterEmbedUrl, getYouTubeVideoId, containsFacebookUrl } from "../../../utils/GetYoutubeLink";
import { isAdmin, getCurrentUser } from "../../modules/auth/session.ts";
import { moveToTrash } from "../../modules/service/trashService";   // ✅ import trash service

import MuiModal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export interface PostData {
  post: any;
  pageIndex: number;
  refreshData: () => void;
  showEdit?: boolean;   // edit permission (creator or admin)
}

const getYouTubeEmbedUrl = (url: string): string | null => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1` : null;
};

const getYouTubeThumbnail = (url: string): string | null => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
};

const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html || '', 'text/html');
  return doc.body.textContent || "";
};

const getFirstNWords = (html: string, n: number) => {
  const text = stripHtml(html);
  return text.split(" ").slice(0, n).join(" ");
};

const PostCard: React.FC<PostData> = ({ post, pageIndex, refreshData, showEdit = true }) => {
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const adminUser = isAdmin();   // ✅ true if logged-in user is ADMIN

  const toggleVideoModal = () => setIsVideoModalOpen(!isVideoModalOpen);
  const toggleImageModal = () => setIsImageModalOpen(!isImageModalOpen);
  const toggleDeleteModal = () => setDeleteModalOpen(!deleteModalOpen);

  // ✅ Updated delete: Move to Trash, then API delete
  const handleDelete = async () => {
    if (post?.id) {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        toast.error("User not logged in");
        return;
      }

      // 1. Move to trash (localStorage)
      moveToTrash({
        id: post.id,
        type: 'post',
        data: post,
      }, currentUser.username);

      // 2. Delete from server (API)
      try {
        await client.delete(`/post/${post.id}`);
        toast.success("Post moved to trash and deleted from server!");
        refreshData();  // refresh the list
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete post from server");
      }
    }
    toggleDeleteModal();
  };

  const externalUrl = post?.video?.externalFile?.url || null;
  const uploadedVideoUrl = post?.video?.internalFile?.video || null;
  const uploadedVideoThumbnail = post?.video?.internalFile?.thumbnail || null;
  const bannerImage = post?.bannerImage || null;

  const isYouTube = !!externalUrl;
  const isUploadedVideo = !!uploadedVideoUrl;
  const isImage = !!bannerImage;
  const hasVideo = isYouTube || isUploadedVideo;
  let videoPlayer;
  let videoIcon = <PlayCircleOutlineIcon sx={{ fontSize: 60 }} />;

  let displayImage: string = "";

  if (isYouTube) {
    displayImage = getYouTubeThumbnail(externalUrl) || "";
    let embedUrl = "";
    let platform = "";

    const youtubeId = getYouTubeVideoId(externalUrl);
    const twitterEmbed = getTwitterEmbedUrl(externalUrl);
    const instagramEmbed = getInstagramEmbedUrl(externalUrl);
    const facebookEmbed = containsFacebookUrl(externalUrl);

    if (youtubeId) {
      embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
      platform = "YouTube";
      videoIcon = <YouTubeIcon sx={{ fontSize: 60 }} />;
    } else if (twitterEmbed) {
      embedUrl = twitterEmbed;
      platform = "Twitter";
      videoIcon = <XIcon sx={{ fontSize: 60 }} />;
    } else if (instagramEmbed) {
      embedUrl = instagramEmbed;
      platform = "Instagram";
      videoIcon = <InstagramIcon sx={{ fontSize: 60 }} />;
    } else if (facebookEmbed) {
      embedUrl = externalUrl;
      platform = "Facebook";
      videoIcon = <FacebookIcon sx={{ fontSize: 60 }} />;
    }

    if (embedUrl) {
      if (platform === "YouTube") {
        videoPlayer = (
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"} position={"relative"} maxWidth={450} width={"100%"} height={"100%"}>
            <iframe
              src={embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube video player"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
            />
          </Box>
        );
      } else if (platform === "Twitter") {
        videoPlayer = (
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%", height: "100%" }}
          >
            <iframe
              src={embedUrl}
              title="Twitter post"
              style={{
                border: "none",
                maxWidth: "550px",
                width: "100%",
                minHeight: "500px",
              }}
            />
          </div>
        );
      } else if (platform === "Instagram") {
        videoPlayer = (
          <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <div
              style={{
                position: "relative",
                paddingTop: "125%",
                width: "100%",
                overflow: "hidden",
              }}
            >
              <iframe
                src={embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Instagram post"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                  overflow: "hidden",
                  display: "block",
                }}
              />
            </div>
          </div>
        );
      } else if (platform === "Facebook") {
        videoPlayer = (
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"} position={"relative"} maxWidth={450} width={"100%"} height={"100%"}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
              dangerouslySetInnerHTML={{
                __html: embedUrl
                  .replace(/width="[^"]*"/, 'width="100%"')
                  .replace(/height="[^"]*"/, 'height="100%"'),
              }}
            />
          </Box>
        );
      }
    } else {
      videoPlayer = (
        <Box p={isSmallScreen ? 1 : 2}>
          <p>Could not load external video/post from: {externalUrl}</p>
          <a href={externalUrl} target="_blank" rel="noopener noreferrer">
            Open link in new tab
          </a>
        </Box>
      );
    }
  } else if (isUploadedVideo) {
    displayImage = uploadedVideoThumbnail || "";
    videoPlayer = (
      <video style={{ width: "100%", height: "100%" }} controls autoPlay>
        <source src={uploadedVideoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  } else if (isImage) {
    displayImage = bannerImage;
  }

  const handleCardClick = () => {
    if (hasVideo) {
      toggleVideoModal();
    } else if (isImage) {
      toggleImageModal();
    }
  };

  const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '800px',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    overflowY: 'auto',
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      <Modal
        header="Delete Post?"
        isOpen={deleteModalOpen}
        toggleDialog={toggleDeleteModal}
        action2={{ event: toggleDeleteModal, label: 'Cancel' }}
        action1={{ event: () => { handleDelete(); }, label: "Delete" }}
        title="Are you sure you want to delete this post?"
      />

      {/* Video Player Modal */}
      <VideoModal
        toggleModal={toggleVideoModal}
        isOpen={isVideoModalOpen}
        videoPlayer={videoPlayer}
        title={post?.title}
        description={post?.description}
        data={post}
      />

      {/* Image Modal */}
      <MuiModal open={isImageModalOpen} onClose={toggleImageModal}>
        <Box sx={modalStyle}>
          <IconButton
            onClick={toggleImageModal}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: 'auto' }}>
            <Box sx={{ width: '100%', height: 'auto', maxHeight: '60vh', overflow: 'hidden' }}>
              <img
                src={displayImage}
                alt={stripHtml(post?.title)}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Box>
            <Box sx={{ padding: 2, overflowY: 'auto', height: 'auto', marginTop: 2 }}>
              <Typography variant="h5" gutterBottom dangerouslySetInnerHTML={{ __html: post?.title }} />
              <Typography variant="body1" dangerouslySetInnerHTML={{ __html: post?.description }} />
            </Box>
          </Box>
        </Box>
      </MuiModal>

      {/* Post Card */}
      <Card
        className='bg-light'
        style={{ position: "relative", height: '100%', cursor: 'pointer' }}
        onClick={handleCardClick}
      >
        <div style={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="194"
            image={displayImage || ImgNotFound}
            alt="Post media"
          />
          {hasVideo && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                pointerEvents: 'none',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '50%',
                padding: '8px'
              }}
            >
              {videoIcon}
            </div>
          )}
        </div>

        <CardContent sx={{ paddingTop: 1, paddingBottom: 1 }}>
          <Typography noWrap sx={{ fontSize: '15px', fontWeight: 'bold' }} title={stripHtml(post?.title)}>
            {stripHtml(post?.title)}
          </Typography>
          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
            {getFirstNWords(post?.description, 20)}
          </Typography>
        </CardContent>

        <CardActions disableSpacing sx={{ padding: '16px' }}>
          <Stack gap={1}>
            <Typography variant="caption">Comments: {post?.insights?.noOfComments || 0}</Typography>
            <Typography variant="caption">Likes: {post?.insights?.noOfLikes || 0}</Typography>
          </Stack>
          <div className="d-flex gap-2" style={{ marginLeft: "auto" }}>
            {/* ✅ Delete button shown only for admin users */}
            {adminUser && (
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDeleteModal();
                }}
                className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              >
                <KTIcon iconName="trash" className="fs-3 text-danger" />
              </a>
            )}
            {/* Edit button shown only if showEdit is true (creator or admin) */}
            {showEdit && (
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/post/create/${post?.id}`);
                }}
                className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
              >
                <KTIcon iconName="pencil" className="fs-3 text-primary" />
              </a>
            )}
          </div>
        </CardActions>
      </Card>
    </>
  );
};

export default PostCard;
