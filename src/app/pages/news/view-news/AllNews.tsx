// //view-news//AllNews.tsx
// import React, { useState, useEffect } from "react";
// import {
//   CircularProgress,
//   Modal as MuiModal,
//   Box,
//   CardMedia,
//   MobileStepper,
//   Button as MuiButton,
//   Paper,
//   useTheme,
//   IconButton,
//   useMediaQuery,
//   TextField,
//   Button,
//   ToggleButtonGroup,
//   ToggleButton,
//   Chip,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   SelectChangeEvent,
//   Card,
//   CardContent,
//   Typography,
//   CardActions,
// } from "@mui/material/";
// import CloseIcon from "@mui/icons-material/Close";
// import ViewModuleIcon from "@mui/icons-material/ViewModule";
// import ViewListIcon from "@mui/icons-material/ViewList";
// import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
// import { toAbsoluteUrl } from "../../../../_metronic/helpers";
// import client from "../../../modules/service/network";
// import { Modal } from "../../../../_metronic/partials/widgets/modal/Modal";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import Shimmer from "../../../common/shimmer/Shimmer";
// import NoData from "../../../common/nodata/NoData";
// import { NewsItem } from "./NewsTypes";
// import { NewsItemCarousel } from "./Carousel";
// import { VideoNewsCard } from "./VideoNewsCard";
// import { SimpleNewsCard } from "./SimpleNewsCard";
// import { NewsListItem } from "./NewsListItem";
// import { getCurrentUser, isAdmin} from '../../../modules/auth/session';
// import { getYouTubeVideoId, getInstagramEmbedUrl, getTwitterEmbedUrl, getFacebookEmbedReel, getIframeEmbedCode} from "../../../../utils/GetYoutubeLink";
// import { moveToTrash, isInTrash } from "../../../modules/service/trashService";

// // ✅ AdCard – supports both formats (storyCards or bannerImages)
// const AdCard: React.FC<{ ad: any }> = ({ ad }) => {
//   let imageUrl = toAbsoluteUrl("/media/image-not-found.png");
//   let title = 'Advertisement';
//   let description = '';
//   let link = '';

//   if (ad.storyCards && ad.storyCards.length > 0) {
//     const firstCard = ad.storyCards[0];
//     imageUrl = firstCard.bannerImage || toAbsoluteUrl("/media/image-not-found.png");
//     title = firstCard.description ? (firstCard.description.length > 50 ? firstCard.description.substring(0, 50) + '...' : firstCard.description) : 'Advertisement';
//     description = firstCard.description || '';
//     link = firstCard.description || '';
//   } else if (ad.bannerImages && ad.bannerImages.length > 0) {
//     imageUrl = ad.bannerImages[0] || toAbsoluteUrl("/media/image-not-found.png");
//     title = ad.link ? (ad.link.length > 50 ? ad.link.substring(0, 50) + '...' : ad.link) : 'Advertisement';
//     description = ad.link || '';
//     link = ad.link || '';
//   }

//   return (
//     <div className="col-12 col-sm-6 col-md-4 col-xl-4 mb-4">
//       <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//         <CardMedia
//           component="img"
//           height="194"
//           image={imageUrl}
//           alt={title}
//         />
//         <CardContent sx={{ flexGrow: 1 }}>
//           <Typography gutterBottom variant="h6" component="div" noWrap>
//             {title}
//           </Typography>
//           <Typography 
//             variant="body2" 
//             color="text.secondary" 
//             sx={{ 
//               overflow: 'hidden', 
//               textOverflow: 'ellipsis', 
//               display: '-webkit-box', 
//               WebkitLineClamp: 2, 
//               WebkitBoxOrient: 'vertical' 
//             }}
//           >
//             {description}
//           </Typography>
//         </CardContent>
//         {link && (
//           <CardActions>
//             <Button size="small" href={link} target="_blank">
//               Learn More
//             </Button>
//           </CardActions>
//         )}
//       </Card>
//     </div>
//   );
// };

// const modalStyle = {
//   position: "absolute" as const,
//   top: "50%",
//   left: "50%",
//   borderRadius: 2,
//   transform: "translate(-50%, -50%)",
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 2,
//   maxHeight: "90vh",
//   overflowY: "auto",
//   width: "90%",
//   maxWidth: "500px",
//   "@media (max-width:600px)": {
//     width: "95%",
//     p: 1,
//   },
// };

// type FeedItem = NewsItem & { isAd?: boolean };

// const AllNews: React.FC = () => {
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

//   const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [queryParams, setQueryParams] = useState({ page: 0, size: 10 });
//   const [id, setId] = useState("");
//   const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [openDeleteModal, setOpenDeleteModal] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [layout, setLayout] = useState<'grid' | 'list'>('grid');
//   const [activeCarouselStep, setActiveCarouselStep] = useState(0);

//   const adminUser = isAdmin();
//   const currentUser = getCurrentUser();
//   const currentUsername = currentUser?.username || "";

//   const [newsCreators, setNewsCreators] = useState<Record<string, string>>({});

//   useEffect(() => {
//     const stored = localStorage.getItem("news_creators");
//     if (stored) {
//       setNewsCreators(JSON.parse(stored));
//     }
//   }, []);
  
//   const findDateTime = (timestamp: string): [string, string] => {
//     if (!timestamp) return ["", ""];
//     const date = new Date(timestamp);
//     const formattedDate = date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
//     const formattedTime = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
//     return [formattedDate, formattedTime];
//   };

//   const fetchData = async (page: number, query: string) => {
//     setLoading(true);
//     try {
//       const isSearching = query.trim() !== "";
//       const newsEndpoint = isSearching ? "/news/search" : "/news";
//       const newsParams = {
//         ...queryParams,
//         page,
//         sort: "updatedAt,desc",
//         ...(isSearching && { query: query.trim() }),
//       };

//       // 1️⃣ Fetch news (including ads with isAd: true)
//       const newsResponse = await client.get(newsEndpoint, { params: newsParams });
//       let allNewsData = isSearching ? newsResponse.data.content : newsResponse.data;
//       allNewsData = allNewsData?.filter((item: NewsItem) => !isInTrash(item.id, 'news')) || [];
      
//       // 2️⃣ Separate ads from regular news
//       const adsData = allNewsData
//         .filter((item: any) => item.isAd === true)
//         .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // latest first

//       const regularNews = allNewsData.filter((item: any) => !item.isAd);

//       console.log(`✅ Fetched ${regularNews.length} news items, ${adsData.length} ads`);

//       // ============================================================
//       // 🆕 3️⃣ FEED LOGIC: Every 2 News → Show Add (each Ad shown 3 times)
//       // ============================================================
//       const AD_INTERVAL = 2;   // after every 2 news, show an add
//       const AD_REPEAT = 3;     // each ad shown 3 times

//       // Create a queue of ads: each ad repeated AD_REPEAT times
//       const adQueue: any[] = [];
//       adsData.forEach(ad => {
//         for (let i = 0; i < AD_REPEAT; i++) {
//           adQueue.push(ad);
//         }
//       });

//       const combined: FeedItem[] = [];
//       let adIndex = 0;
//       for (let i = 0; i < regularNews.length; i++) {
//         combined.push(regularNews[i]);
//         // After every AD_INTERVAL news, insert an ad if available
//         if ((i + 1) % AD_INTERVAL === 0 && adIndex < adQueue.length) {
//           combined.push({ ...adQueue[adIndex], isAd: true });
//           adIndex++;
//         }
//       }
//       // Append remaining ads at the end
//       while (adIndex < adQueue.length) {
//         combined.push({ ...adQueue[adIndex], isAd: true });
//         adIndex++;
//       }

//       console.log(`📊 Total feed items: ${combined.length} (${regularNews.length} news, ${adsData.length} ads repeated ${AD_REPEAT} times)`);
//       setFeedItems(combined);
//     } catch (error) {
//       console.error('❌ Error fetching data:', error);
//       setFeedItems([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData(queryParams.page, searchQuery);
//   }, [queryParams]);

//   const handleSearch = () => {
//     if (queryParams.page !== 0) {
//       setQueryParams((prev) => ({ ...prev, page: 0 }));
//     } else {
//       fetchData(0, searchQuery);
//     }
//   };

//   const handleLayoutChange = (event: React.MouseEvent<HTMLElement>, newLayout: 'grid' | 'list' | null) => {
//     if (newLayout !== null) {
//       setLayout(newLayout);
//     }
//   };

//   const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
//     const newSize = event.target.value as number;
//     setQueryParams((prev) => ({ ...prev, size: newSize, page: 0 }));
//   };

//   const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newQuery = e.target.value;
//     setSearchQuery(newQuery);
//     if (newQuery.trim() === "") {
//       setQueryParams((prev) => ({ ...prev, page: 0 }));
//     }
//   };

//   const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   const handleReadMoreClick = (newsItem: NewsItem) => {
//     setSelectedNews(newsItem);
//     setActiveCarouselStep(0);
//     setIsModalOpen(true);
//   };

//   const handleEdit = (newsItem: NewsItem) => {
//     const currentUser = getCurrentUser();
//     const isAdminUser = currentUser?.role === "ADMIN";
//     const isOwner = currentUser?.username === (newsItem as any)?.createdBy;

//     if (!isAdminUser && !isOwner) {
//       toast.error("You can edit only your own news");
//       return;
//     }

//     const isStory = newsItem.storyCards && newsItem.storyCards.length > 0;

//     if (isStory) {
//       navigate(`/news/create/${newsItem.id}`, {
//         state: { isStory: true },
//       });
//     } else {
//       navigate(`/news/create/${newsItem.id}`);
//     }
//   };

//   const handleDeleteAndClose = async (idToDelete: string) => {
//     const currentUser = getCurrentUser();
    
//     if (!currentUser) {
//       toast.error("You must be logged in to delete");
//       setOpenDeleteModal(false);
//       return;
//     }

//     const isAdminUser = currentUser.role === "ADMIN";
    
//     const deletedItem = feedItems.find(item => item.id === idToDelete && !item.isAd);
//     if (!deletedItem) {
//       toast.error("Item not found");
//       setOpenDeleteModal(false);
//       return;
//     }

//     const isOwner = currentUser.username === (deletedItem as any)?.createdBy;

//     if (!isAdminUser && !isOwner) {
//       toast.error('You can delete only your own news articles');
//       setOpenDeleteModal(false);
//       return;
//     }
    
//     const itemTitle = deletedItem.title?.substring(0, 50) || 'News article';
    
//     setLoading(true);
    
//     moveToTrash({
//       id: idToDelete,
//       type: 'news',
//       data: deletedItem,
//     }, currentUser.username);
    
//     try {
//       await client.delete(`news/${idToDelete}`);
//       console.log('API delete successful for:', idToDelete);
//     } catch (error: any) {
//       console.error('API delete failed:', error);
//     }
    
//     setFeedItems(prev => prev.filter(item => item.id !== idToDelete));
//     toast.success(`"${itemTitle}" deleted and moved to trash.`);
    
//     setLoading(false);
//     setOpenDeleteModal(false);
//     await fetchData(queryParams.page, searchQuery);
//   };

//   const toggleDeleteModal = () => setOpenDeleteModal(!openDeleteModal);

//   function decrement() {
//     if (queryParams.page > 0) {
//       setQueryParams((prev) => ({ ...prev, page: prev.page - 1 }));
//     }
//   }

//   function increment() {
//     const nonAdItems = feedItems.filter(item => !item.isAd);
//     if (nonAdItems.length < queryParams.size) {
//       return;
//     }
//     setQueryParams((prev) => ({ ...prev, page: prev.page + 1 }));
//   }

//   const renderModalContent = () => {
//     if (!selectedNews) return null;

//     const hasStoryCards = selectedNews.storyCards && selectedNews.storyCards.length > 0;
//     const hasVideo = selectedNews.video && (selectedNews.video.internalFile?.video || selectedNews.video.externalFile?.url);

//     if (hasStoryCards) {
//       const storyCards = selectedNews.storyCards || [];
//       const maxSteps = storyCards.length;
//       const activeCard = storyCards[activeCarouselStep];
//       const imageUrl = typeof activeCard.bannerImage === "string" ? activeCard.bannerImage : activeCard.bannerImage?.path;
//       return (
//         <Paper>
//           <Box p={isSmallScreen ? 1 : 3} pb={1}>
//             <h2 dangerouslySetInnerHTML={{ __html: selectedNews.title }} />
//           </Box>
//           <CardMedia
//             component="img"
//             height={isSmallScreen ? "200" : "400"}
//             image={imageUrl || toAbsoluteUrl("/media/image-not-found.png")}
//             alt={activeCard.title}
//             style={{ objectFit: "cover", width: "100%" }}
//           />
//           <Box p={isSmallScreen ? 1 : 3}>
//             <h3 dangerouslySetInnerHTML={{ __html: activeCard.title }} />
//             <p dangerouslySetInnerHTML={{ __html: activeCard.description }} />
//           </Box>
//           {selectedNews.tags && selectedNews.tags.length > 0 && (
//             <Box sx={{ px: isSmallScreen ? 1 : 3, pb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//               {selectedNews.tags.map((tag, index) => <Chip key={index} label={tag} variant="outlined" />)}
//             </Box>
//           )}
//           {maxSteps > 1 && (
//             <MobileStepper
//               steps={maxSteps}
//               position="static"
//               activeStep={activeCarouselStep}
//               nextButton={
//                 <MuiButton size="small" onClick={() => setActiveCarouselStep((prev) => prev + 1)} disabled={activeCarouselStep === maxSteps - 1}>
//                   Next <KeyboardArrowRight />
//                 </MuiButton>
//               }
//               backButton={
//                 <MuiButton size="small" onClick={() => setActiveCarouselStep((prev) => prev - 1)} disabled={activeCarouselStep === 0}>
//                   <KeyboardArrowLeft /> Back
//                 </MuiButton>
//               }
//             />
//           )}
//         </Paper>
//       );
//     }

//     if (hasVideo) {
//       let videoPlayer;
//       const videoData = selectedNews.video;

//       if (videoData?.internalFile?.video) {
//         videoPlayer = <video src={videoData.internalFile.video} controls autoPlay width="100%" style={{ maxHeight: isSmallScreen ? "300px" : "500px", borderRadius: "4px", display: "block" }} />;
//       } else if (videoData?.externalFile?.url) {
//         const url = videoData.externalFile.url;
//         let embedUrl = "";
//         let platform = "";
//         const iFrame = getIframeEmbedCode(url);
//         const youtubeId = getYouTubeVideoId(url);
//         const twitterEmbed = getTwitterEmbedUrl(url);
//         const instagramEmbed = getInstagramEmbedUrl(url);
//         const facebookEmbed = getFacebookEmbedReel(url);

//         if (iFrame) platform = "iFrame";
//         else if (youtubeId) { embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`; platform = "YouTube"; }
//         else if (twitterEmbed) { embedUrl = twitterEmbed; platform = "Twitter"; }
//         else if (facebookEmbed) { embedUrl = facebookEmbed; platform = "Facebook"; }
//         else if (instagramEmbed) { embedUrl = instagramEmbed; platform = "Instagram"; }

//         if (embedUrl) {
//           if (platform === "YouTube" || platform === "Instagram") {
//             videoPlayer = (
//               <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", maxWidth: "100%" }}>
//                 <iframe src={embedUrl} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={`${platform} video player`} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }} />
//               </div>
//             );
//           } else if (platform === "Twitter") {
//             videoPlayer = (
//               <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
//                 <iframe src={embedUrl} title="Twitter post" style={{ border: "none", maxWidth: "550px", width: "100%", minHeight: "500px" }} />
//               </div>
//             );
//           } else if (platform === "Facebook") {
//             videoPlayer = (
//               <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", maxWidth: "100%" }}>
//                 <iframe src={embedUrl} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen title="Facebook video player" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }} />
//               </div>
//             );
//           }
//         } else if (iFrame) {
//           videoPlayer = <div style={{ width: "100%" }} dangerouslySetInnerHTML={{ __html: iFrame }} />;
//         } else {
//           videoPlayer = (
//             <Box p={isSmallScreen ? 1 : 2}>
//               <p>Could not load external video/post from: {url}</p>
//               <a href={url} target="_blank" rel="noopener noreferrer">Open link in new tab</a>
//             </Box>
//           );
//         }
//       }
//       return (
//         <Box>
//           {videoPlayer}
//           <Box p={isSmallScreen ? 1 : 3}>
//             <h2 dangerouslySetInnerHTML={{ __html: selectedNews.title }} />
//             <p dangerouslySetInnerHTML={{ __html: selectedNews.description }} />
//             {selectedNews.tags && selectedNews.tags.length > 0 && (
//               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
//                 {selectedNews.tags.map((tag, index) => <Chip key={index} label={tag} variant="outlined" />)}
//               </Box>
//             )}
//           </Box>
//         </Box>
//       );
//     }

//     const imageUrl = typeof selectedNews.bannerImage === 'string' ? selectedNews.bannerImage : selectedNews.bannerImage?.path;
//     return (
//       <Paper>
//         <CardMedia component="img" height={isSmallScreen ? "200" : "400"} image={imageUrl || toAbsoluteUrl("/media/image-not-found.png")} alt={selectedNews.title} style={{ objectFit: "cover", width: '100%' }} />
//         <Box p={isSmallScreen ? 1 : 3}>
//           <h2 dangerouslySetInnerHTML={{ __html: selectedNews.title }} />
//           <p dangerouslySetInnerHTML={{ __html: selectedNews.description }} />
//           {selectedNews.tags && selectedNews.tags.length > 0 && (
//             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
//               {selectedNews.tags.map((tag, index) => <Chip key={index} label={tag} variant="outlined" />)}
//             </Box>
//           )}
//         </Box>
//       </Paper>
//     );
//   };

//   if (loading && queryParams.page === 0) {
//     return <div className="row g-6 g-xl-9 mb-6 mb-xl-9"><Shimmer /></div>;
//   }

//   const nonAdCount = feedItems.filter(item => !item.isAd).length;

//   return (
//     <>
//       <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={2.5}>
//         <Box display="flex" alignItems="center" gap={2}>
//           <ToggleButtonGroup value={layout} exclusive onChange={handleLayoutChange} aria-label="layout">
//             <ToggleButton value="grid" aria-label="grid view"><ViewModuleIcon /></ToggleButton>
//             <ToggleButton value="list" aria-label="list view"><ViewListIcon /></ToggleButton>
//           </ToggleButtonGroup>
//           <FormControl size="small" variant="filled" sx={{ minWidth: 120 }}>
//             <InputLabel id="page-size-label">Items per page</InputLabel>
//             <Select labelId="page-size-label" id="page-size-select" value={queryParams.size} label="Items per page" onChange={handlePageSizeChange} sx={{ borderRadius: 2 }}>
//               <MenuItem value={10}>10</MenuItem>
//               <MenuItem value={20}>20</MenuItem>
//               <MenuItem value={30}>30</MenuItem>
//               <MenuItem value={50}>50</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>
//         <Box display="flex" alignItems="center" gap={1}>
//           <TextField
//             type="text"
//             size="medium"
//             placeholder="Search news"
//             value={searchQuery}
//             onChange={handleSearchInputChange}
//             onKeyDown={handleSearchKeyDown}
//             sx={{ width: 256, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//           />
//           <Button
//             onClick={handleSearch}
//             disabled={!searchQuery.trim()}
//             variant="contained"
//             sx={{ width: 80, height: 40, borderRadius: 2, textTransform: 'none', backgroundColor: '#2586fd', '&:hover': { backgroundColor: '#1a6cd9' }, '&.Mui-disabled': { opacity: 0.5 } }}
//           >
//             Search
//           </Button>
//           <Button
//             variant="outlined"
//             onClick={() => navigate('/news/create', { state: { isAd: true } })}
//             sx={{ height: 40, borderRadius: 2, textTransform: 'none', borderColor: '#2586fd', color: '#2586fd' }}
//           >
//             + Create Ad
//           </Button>
//         </Box>
//       </Box>

//       <MuiModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <Box sx={{ ...modalStyle, wordBreak: "break-word", whiteSpace: "pre-line" }}>
//           <IconButton onClick={() => setIsModalOpen(false)} sx={{ position: "absolute", top: 8, right: 8, zIndex: 1, backgroundColor: "rgba(255, 255, 255, 0.7)" }}><CloseIcon /></IconButton>
//           <Box sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }}>{renderModalContent()}</Box>
//         </Box>
//       </MuiModal>

//       {openDeleteModal && (
//         <Modal header="Delete News?" isOpen={openDeleteModal} toggleDialog={toggleDeleteModal} action2={{ event: toggleDeleteModal, label: "Cancel" }} action1={{ event: () => handleDeleteAndClose(id), label: "Delete" }} title={""} />
//       )}

//       {loading ? (
//         <div className="d-flex justify-content-center align-items-center p-5"><CircularProgress /></div>
//       ) : feedItems.length > 0 ? (
//         <div className="row">
//           {feedItems.map((item) => {
//             if (item.isAd) {
//               return <AdCard key={`ad-${item.id}`} ad={item} />;
//             }

//             const newsItem = item as NewsItem;
//             const currentUser = getCurrentUser();
//             const isAdminUser = currentUser?.role === "ADMIN";
//             const isOwner = currentUser?.username === (newsItem as any)?.createdBy;
//             const showEditDelete = isAdminUser || isOwner;

//             const commonProps = {
//               newsItem,
//               findDateTime,
//               onReadMore: () => handleReadMoreClick(newsItem),
//               onEdit: () => {
//                 if (!showEditDelete) {
//                   toast.error("You can edit only your own news");
//                   return;
//                 }
//                 handleEdit(newsItem);
//               },
//               onDelete: () => {
//                 if (!showEditDelete) {
//                   toast.error("You can delete only your own news");
//                   return;
//                 }
//                 toggleDeleteModal();
//                 setId(newsItem.id);
//               }
//             };

//             return (
//               <div key={newsItem.id} className={layout === 'grid' ? "col-12 col-sm-6 col-md-4 col-xl-4 mb-4" : "col-12 mb-4"} style={layout === 'list' ? { display: 'flex' } : {}}>
//                 {layout === 'grid' ? (
//                   <div className="card w-100 h-100" style={{ display: "flex", flexDirection: "column" }}>
//                     {(() => {
//                       const hasStoryCards = newsItem.storyCards && newsItem.storyCards.length > 0;
//                       const hasVideo = newsItem.video && (newsItem.video.internalFile?.video || newsItem.video.externalFile?.url);
//                       if (hasStoryCards) return <NewsItemCarousel {...commonProps} />;
//                       else if (hasVideo) return <VideoNewsCard {...commonProps} />;
//                       else return <SimpleNewsCard {...commonProps} />;
//                     })()}
//                   </div>
//                 ) : (<NewsListItem {...commonProps} />)}
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <NoData title={"News"} createUrl={"/news/create"} />
//       )}
      
//       <div style={{ display: "flex", justifyContent: "center", marginTop: 20, marginBottom: 20 }}>
//         <button
//           disabled={queryParams.page === 0}
//           onClick={decrement}
//           className="bg-light"
//           style={{ marginRight: 10, width: 100, height: 40, borderRadius: 20, display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", border: "2px solid white", padding: 10, boxShadow: "0px 2px 4px rgba(0,0,0,0.5)" }}
//         >
//           Previous
//         </button>
//         <button
//           disabled={nonAdCount < queryParams.size}
//           onClick={increment}
//           className="bg-light"
//           style={{ marginLeft: 10, width: 100, height: 40, borderRadius: 20, display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", border: "2px solid white", padding: 10, boxShadow: "0px 2px 4px rgba(0,0,0,0.5)" }}
//         >
//           Next
//         </button>
//       </div>
//     </>
//   );
// };

// export { AllNews };


// src/app/pages/news/view-news/AllNews.tsx
import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  Modal as MuiModal,
  Box,
  CardMedia,
  MobileStepper,
  Button as MuiButton,
  Paper,
  useTheme,
  IconButton,
  useMediaQuery,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Card,
  CardContent,
  Typography,
  CardActions,
} from "@mui/material/";
import CloseIcon from "@mui/icons-material/Close";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import client from "../../../modules/service/network";
import { Modal } from "../../../../_metronic/partials/widgets/modal/Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Shimmer from "../../../common/shimmer/Shimmer";
import NoData from "../../../common/nodata/NoData";
import { NewsItem } from "./NewsTypes";
import { NewsItemCarousel } from "./Carousel";
import { VideoNewsCard } from "./VideoNewsCard";
import { SimpleNewsCard } from "./SimpleNewsCard";
import { NewsListItem } from "./NewsListItem";
import { getCurrentUser, isAdmin } from "../../../modules/auth/session";
import {
  getYouTubeVideoId,
  getInstagramEmbedUrl,
  getTwitterEmbedUrl,
  getFacebookEmbedReel,
  getIframeEmbedCode,
} from "../../../../utils/GetYoutubeLink";
import { moveToTrash, isInTrash } from "../../../modules/service/trashService";

// AdCard - supports both formats (storyCards or bannerImages)
const AdCard: React.FC<{ ad: any }> = ({ ad }) => {
  let imageUrl = toAbsoluteUrl("/media/image-not-found.png");
  let title = "Advertisement";
  let description = "";
  let link = "";

  if (ad.storyCards && ad.storyCards.length > 0) {
    const firstCard = ad.storyCards[0];
    imageUrl = firstCard.bannerImage || toAbsoluteUrl("/media/image-not-found.png");
    title = firstCard.description
      ? firstCard.description.length > 50
        ? firstCard.description.substring(0, 50) + "..."
        : firstCard.description
      : "Advertisement";
    description = firstCard.description || "";
    link = firstCard.description || "";
  } else if (ad.bannerImages && ad.bannerImages.length > 0) {
    imageUrl = ad.bannerImages[0] || toAbsoluteUrl("/media/image-not-found.png");
    title = ad.link
      ? ad.link.length > 50
        ? ad.link.substring(0, 50) + "..."
        : ad.link
      : "Advertisement";
    description = ad.link || "";
    link = ad.link || "";
  }

  return (
    <div className="col-12 col-sm-6 col-md-4 col-xl-4 mb-4">
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardMedia component="img" height="194" image={imageUrl} alt={title} />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {description}
          </Typography>
        </CardContent>
        {link && (
          <CardActions>
            <Button size="small" href={link} target="_blank">
              Learn More
            </Button>
          </CardActions>
        )}
      </Card>
    </div>
  );
};

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  borderRadius: 2,
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  maxHeight: "90vh",
  overflowY: "auto",
  width: "90%",
  maxWidth: "500px",
  "@media (max-width:600px)": {
    width: "95%",
    p: 1,
  },
};

type FeedItem = NewsItem & { isAd?: boolean };

const AllNews: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [queryParams, setQueryParams] = useState({ page: 0, size: 10 });
  const [id, setId] = useState("");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [activeCarouselStep, setActiveCarouselStep] = useState(0);

  const adminUser = isAdmin();
  const currentUser = getCurrentUser();
  const currentUsername = currentUser?.username || "";

  const [newsCreators, setNewsCreators] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = localStorage.getItem("news_creators");
    if (stored) {
      setNewsCreators(JSON.parse(stored));
    }
  }, []);

  const findDateTime = (timestamp: string): [string, string] => {
    if (!timestamp) return ["", ""];
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

  const fetchData = async (page: number, query: string) => {
    setLoading(true);
    try {
      const isSearching = query.trim() !== "";
      const newsEndpoint = isSearching ? "/news/search" : "/news";
      const newsParams = {
        ...queryParams,
        page,
        sort: "updatedAt,desc",
        ...(isSearching && { query: query.trim() }),
      };

      // 1. Fetch news (including ads with isAd: true)
      const newsResponse = await client.get(newsEndpoint, { params: newsParams });
      let allNewsData = isSearching ? newsResponse.data.content : newsResponse.data;
      allNewsData =
        allNewsData?.filter((item: NewsItem) => !isInTrash(item.id, "news")) || [];

      // 2. Separate ads from regular news
      const adsData = allNewsData
        .filter((item: any) => item.isAd === true)
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      const regularNews = allNewsData.filter((item: any) => !item.isAd);

      console.log(
        `Fetched ${regularNews.length} news items, ${adsData.length} ads`
      );

      // ============================================================
      // FEED LOGIC:
      //  - One ad after every 5 news items (AD_INTERVAL = 5)
      //  - Maximum 3 ad slots total (AD_TOTAL_SLOTS = 3)
      //  - If more than one ad exists, rotate between them
      // ============================================================
      const AD_INTERVAL = 5;
      const AD_TOTAL_SLOTS = 3;

      const combined: FeedItem[] = [];
      let adSlotUsed = 0;
      let adRotationIndex = 0;

      for (let i = 0; i < regularNews.length; i++) {
        combined.push(regularNews[i]);

        if (
          (i + 1) % AD_INTERVAL === 0 &&
          adSlotUsed < AD_TOTAL_SLOTS &&
          adsData.length > 0
        ) {
          const adToShow = adsData[adRotationIndex % adsData.length];
          combined.push({ ...adToShow, isAd: true });
          adSlotUsed++;
          adRotationIndex++;
        }
      }

      console.log(
        `Total feed items: ${combined.length} | News: ${regularNews.length} | Ad slots used: ${adSlotUsed}/${AD_TOTAL_SLOTS}`
      );
      setFeedItems(combined);
    } catch (error) {
      console.error("Error fetching data:", error);
      setFeedItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(queryParams.page, searchQuery);
  }, [queryParams]);

  const handleSearch = () => {
    if (queryParams.page !== 0) {
      setQueryParams((prev) => ({ ...prev, page: 0 }));
    } else {
      fetchData(0, searchQuery);
    }
  };

  const handleLayoutChange = (
    event: React.MouseEvent<HTMLElement>,
    newLayout: "grid" | "list" | null
  ) => {
    if (newLayout !== null) {
      setLayout(newLayout);
    }
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newSize = event.target.value as number;
    setQueryParams((prev) => ({ ...prev, size: newSize, page: 0 }));
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    if (newQuery.trim() === "") {
      setQueryParams((prev) => ({ ...prev, page: 0 }));
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleReadMoreClick = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setActiveCarouselStep(0);
    setIsModalOpen(true);
  };

  const handleEdit = (newsItem: NewsItem) => {
    const currentUser = getCurrentUser();
    const isAdminUser = currentUser?.role === "ADMIN";
    const isOwner = currentUser?.username === (newsItem as any)?.createdBy;

    if (!isAdminUser && !isOwner) {
      toast.error("You can edit only your own news");
      return;
    }

    const isStory = newsItem.storyCards && newsItem.storyCards.length > 0;

    if (isStory) {
      navigate(`/news/create/${newsItem.id}`, {
        state: { isStory: true },
      });
    } else {
      navigate(`/news/create/${newsItem.id}`);
    }
  };

  const handleDeleteAndClose = async (idToDelete: string) => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      toast.error("You must be logged in to delete");
      setOpenDeleteModal(false);
      return;
    }

    const isAdminUser = currentUser.role === "ADMIN";

    const deletedItem = feedItems.find(
      (item) => item.id === idToDelete && !item.isAd
    );
    if (!deletedItem) {
      toast.error("Item not found");
      setOpenDeleteModal(false);
      return;
    }

    const isOwner = currentUser.username === (deletedItem as any)?.createdBy;

    if (!isAdminUser && !isOwner) {
      toast.error("You can delete only your own news articles");
      setOpenDeleteModal(false);
      return;
    }

    const itemTitle = deletedItem.title?.substring(0, 50) || "News article";

    setLoading(true);

    moveToTrash(
      {
        id: idToDelete,
        type: "news",
        data: deletedItem,
      },
      currentUser.username
    );

    try {
      await client.delete(`news/${idToDelete}`);
      console.log("API delete successful for:", idToDelete);
    } catch (error: any) {
      console.error("API delete failed:", error);
    }

    setFeedItems((prev) => prev.filter((item) => item.id !== idToDelete));
    toast.success(`"${itemTitle}" deleted and moved to trash.`);

    setLoading(false);
    setOpenDeleteModal(false);
    await fetchData(queryParams.page, searchQuery);
  };

  const toggleDeleteModal = () => setOpenDeleteModal(!openDeleteModal);

  function decrement() {
    if (queryParams.page > 0) {
      setQueryParams((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  }

  function increment() {
    const nonAdItems = feedItems.filter((item) => !item.isAd);
    if (nonAdItems.length < queryParams.size) {
      return;
    }
    setQueryParams((prev) => ({ ...prev, page: prev.page + 1 }));
  }

  const renderModalContent = () => {
    if (!selectedNews) return null;

    const hasStoryCards =
      selectedNews.storyCards && selectedNews.storyCards.length > 0;
    const hasVideo =
      selectedNews.video &&
      (selectedNews.video.internalFile?.video ||
        selectedNews.video.externalFile?.url);

    if (hasStoryCards) {
      const storyCards = selectedNews.storyCards || [];
      const maxSteps = storyCards.length;
      const activeCard = storyCards[activeCarouselStep];
      const imageUrl =
        typeof activeCard.bannerImage === "string"
          ? activeCard.bannerImage
          : activeCard.bannerImage?.path;
      return (
        <Paper>
          <Box p={isSmallScreen ? 1 : 3} pb={1}>
            <h2 dangerouslySetInnerHTML={{ __html: selectedNews.title }} />
          </Box>
          <CardMedia
            component="img"
            height={isSmallScreen ? "200" : "400"}
            image={imageUrl || toAbsoluteUrl("/media/image-not-found.png")}
            alt={activeCard.title}
            style={{ objectFit: "cover", width: "100%" }}
          />
          <Box p={isSmallScreen ? 1 : 3}>
            <h3 dangerouslySetInnerHTML={{ __html: activeCard.title }} />
            <p dangerouslySetInnerHTML={{ __html: activeCard.description }} />
          </Box>
          {selectedNews.tags && selectedNews.tags.length > 0 && (
            <Box
              sx={{
                px: isSmallScreen ? 1 : 3,
                pb: 2,
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {selectedNews.tags.map((tag, index) => (
                <Chip key={index} label={tag} variant="outlined" />
              ))}
            </Box>
          )}
          {maxSteps > 1 && (
            <MobileStepper
              steps={maxSteps}
              position="static"
              activeStep={activeCarouselStep}
              nextButton={
                <MuiButton
                  size="small"
                  onClick={() => setActiveCarouselStep((prev) => prev + 1)}
                  disabled={activeCarouselStep === maxSteps - 1}
                >
                  Next <KeyboardArrowRight />
                </MuiButton>
              }
              backButton={
                <MuiButton
                  size="small"
                  onClick={() => setActiveCarouselStep((prev) => prev - 1)}
                  disabled={activeCarouselStep === 0}
                >
                  <KeyboardArrowLeft /> Back
                </MuiButton>
              }
            />
          )}
        </Paper>
      );
    }

    if (hasVideo) {
      let videoPlayer;
      const videoData = selectedNews.video;

      if (videoData?.internalFile?.video) {
        videoPlayer = (
          <video
            src={videoData.internalFile.video}
            controls
            autoPlay
            width="100%"
            style={{
              maxHeight: isSmallScreen ? "300px" : "500px",
              borderRadius: "4px",
              display: "block",
            }}
          />
        );
      } else if (videoData?.externalFile?.url) {
        const url = videoData.externalFile.url;
        let embedUrl = "";
        let platform = "";
        const iFrame = getIframeEmbedCode(url);
        const youtubeId = getYouTubeVideoId(url);
        const twitterEmbed = getTwitterEmbedUrl(url);
        const instagramEmbed = getInstagramEmbedUrl(url);
        const facebookEmbed = getFacebookEmbedReel(url);

        if (iFrame) platform = "iFrame";
        else if (youtubeId) {
          embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
          platform = "YouTube";
        } else if (twitterEmbed) {
          embedUrl = twitterEmbed;
          platform = "Twitter";
        } else if (facebookEmbed) {
          embedUrl = facebookEmbed;
          platform = "Facebook";
        } else if (instagramEmbed) {
          embedUrl = instagramEmbed;
          platform = "Instagram";
        }

        if (embedUrl) {
          if (platform === "YouTube" || platform === "Instagram") {
            videoPlayer = (
              <div
                style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                  overflow: "hidden",
                  maxWidth: "100%",
                }}
              >
                <iframe
                  src={embedUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${platform} video player`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                  }}
                />
              </div>
            );
          } else if (platform === "Twitter") {
            videoPlayer = (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
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
          } else if (platform === "Facebook") {
            videoPlayer = (
              <div
                style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                  overflow: "hidden",
                  maxWidth: "100%",
                }}
              >
                <iframe
                  src={embedUrl}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                  title="Facebook video player"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                  }}
                />
              </div>
            );
          }
        } else if (iFrame) {
          videoPlayer = (
            <div
              style={{ width: "100%" }}
              dangerouslySetInnerHTML={{ __html: iFrame }}
            />
          );
        } else {
          videoPlayer = (
            <Box p={isSmallScreen ? 1 : 2}>
              <p>Could not load external video/post from: {url}</p>
              <a href={url} target="_blank" rel="noopener noreferrer">
                Open link in new tab
              </a>
            </Box>
          );
        }
      }
      return (
        <Box>
          {videoPlayer}
          <Box p={isSmallScreen ? 1 : 3}>
            <h2 dangerouslySetInnerHTML={{ __html: selectedNews.title }} />
            <p dangerouslySetInnerHTML={{ __html: selectedNews.description }} />
            {selectedNews.tags && selectedNews.tags.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                {selectedNews.tags.map((tag, index) => (
                  <Chip key={index} label={tag} variant="outlined" />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      );
    }

    const imageUrl =
      typeof selectedNews.bannerImage === "string"
        ? selectedNews.bannerImage
        : selectedNews.bannerImage?.path;
    return (
      <Paper>
        <CardMedia
          component="img"
          height={isSmallScreen ? "200" : "400"}
          image={imageUrl || toAbsoluteUrl("/media/image-not-found.png")}
          alt={selectedNews.title}
          style={{ objectFit: "cover", width: "100%" }}
        />
        <Box p={isSmallScreen ? 1 : 3}>
          <h2 dangerouslySetInnerHTML={{ __html: selectedNews.title }} />
          <p dangerouslySetInnerHTML={{ __html: selectedNews.description }} />
          {selectedNews.tags && selectedNews.tags.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
              {selectedNews.tags.map((tag, index) => (
                <Chip key={index} label={tag} variant="outlined" />
              ))}
            </Box>
          )}
        </Box>
      </Paper>
    );
  };

  if (loading && queryParams.page === 0) {
    return (
      <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
        <Shimmer />
      </div>
    );
  }

  const nonAdCount = feedItems.filter((item) => !item.isAd).length;

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={2.5}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <ToggleButtonGroup
            value={layout}
            exclusive
            onChange={handleLayoutChange}
            aria-label="layout"
          >
            <ToggleButton value="grid" aria-label="grid view">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <FormControl size="small" variant="filled" sx={{ minWidth: 120 }}>
            <InputLabel id="page-size-label">Items per page</InputLabel>
            <Select
              labelId="page-size-label"
              id="page-size-select"
              value={queryParams.size}
              label="Items per page"
              onChange={handlePageSizeChange}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            type="text"
            size="medium"
            placeholder="Search news"
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyDown={handleSearchKeyDown}
            sx={{
              width: 256,
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          />
          <Button
            onClick={handleSearch}
            disabled={!searchQuery.trim()}
            variant="contained"
            sx={{
              width: 80,
              height: 40,
              borderRadius: 2,
              textTransform: "none",
              backgroundColor: "#2586fd",
              "&:hover": { backgroundColor: "#1a6cd9" },
              "&.Mui-disabled": { opacity: 0.5 },
            }}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/news/create", { state: { isAd: true } })}
            sx={{
              height: 40,
              borderRadius: 2,
              textTransform: "none",
              borderColor: "#2586fd",
              color: "#2586fd",
            }}
          >
            + Create Ad
          </Button>
        </Box>
      </Box>

      <MuiModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{ ...modalStyle, wordBreak: "break-word", whiteSpace: "pre-line" }}
        >
          <IconButton
            onClick={() => setIsModalOpen(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }}>
            {renderModalContent()}
          </Box>
        </Box>
      </MuiModal>

      {openDeleteModal && (
        <Modal
          header="Delete News?"
          isOpen={openDeleteModal}
          toggleDialog={toggleDeleteModal}
          action2={{ event: toggleDeleteModal, label: "Cancel" }}
          action1={{ event: () => handleDeleteAndClose(id), label: "Delete" }}
          title={""}
        />
      )}

      {loading ? (
        <div className="d-flex justify-content-center align-items-center p-5">
          <CircularProgress />
        </div>
      ) : feedItems.length > 0 ? (
        <div className="row">
          {feedItems.map((item, idx) => {
            if (item.isAd) {
              return <AdCard key={`ad-${item.id}-${idx}`} ad={item} />;
            }

            const newsItem = item as NewsItem;
            const currentUser = getCurrentUser();
            const isAdminUser = currentUser?.role === "ADMIN";
            const isOwner =
              currentUser?.username === (newsItem as any)?.createdBy;
            const showEditDelete = isAdminUser || isOwner;

            const commonProps = {
              newsItem,
              findDateTime,
              onReadMore: () => handleReadMoreClick(newsItem),
              onEdit: () => {
                if (!showEditDelete) {
                  toast.error("You can edit only your own news");
                  return;
                }
                handleEdit(newsItem);
              },
              onDelete: () => {
                if (!showEditDelete) {
                  toast.error("You can delete only your own news");
                  return;
                }
                toggleDeleteModal();
                setId(newsItem.id);
              },
            };

            return (
              <div
                key={newsItem.id}
                className={
                  layout === "grid"
                    ? "col-12 col-sm-6 col-md-4 col-xl-4 mb-4"
                    : "col-12 mb-4"
                }
                style={layout === "list" ? { display: "flex" } : {}}
              >
                {layout === "grid" ? (
                  <div
                    className="card w-100 h-100"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    {(() => {
                      const hasStoryCards =
                        newsItem.storyCards && newsItem.storyCards.length > 0;
                      const hasVideo =
                        newsItem.video &&
                        (newsItem.video.internalFile?.video ||
                          newsItem.video.externalFile?.url);
                      if (hasStoryCards)
                        return <NewsItemCarousel {...commonProps} />;
                      else if (hasVideo)
                        return <VideoNewsCard {...commonProps} />;
                      else return <SimpleNewsCard {...commonProps} />;
                    })()}
                  </div>
                ) : (
                  <NewsListItem {...commonProps} />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <NoData title={"News"} createUrl={"/news/create"} />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <button
          disabled={queryParams.page === 0}
          onClick={decrement}
          className="bg-light"
          style={{
            marginRight: 10,
            width: 100,
            height: 40,
            borderRadius: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            border: "2px solid white",
            padding: 10,
            boxShadow: "0px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          Previous
        </button>
        <button
          disabled={nonAdCount < queryParams.size}
          onClick={increment}
          className="bg-light"
          style={{
            marginLeft: 10,
            width: 100,
            height: 40,
            borderRadius: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            border: "2px solid white",
            padding: 10,
            boxShadow: "0px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          Next
        </button>
      </div>
    </>
  );
};

export { AllNews };
