import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardMedia,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { mutate } from "swr";
import client from "../../modules/service/network";
import { toast } from "react-toastify";
import { Modal } from "../../../_metronic/partials/widgets/modal/Modal";
import { KTIcon } from "../../../_metronic/helpers";
import "./style.css";
import VideoModal from "../../common/modals/VideoModal";
import RejectionModal from "../../common/modals/RejectionModalWithMessage";
import { getVideoUrl, getThumbnailUrl, getYouTubeEmbedUrl, getYouTubeThumbnail, isYouTubeUrl, isTwitterUrl, getTweetId, isFacebookUrl } from "./Utils";
import { moveToTrash } from "../../modules/service/trashService";
import { getCurrentUser } from "../../modules/auth/session";

declare global {
  interface Window {
    twttr: any;
  }
}

const TweetEmbed = ({ tweetId }: { tweetId: string }) => {
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createTweet = () => {
      if (window.twttr && window.twttr.widgets && embedRef.current) {
        embedRef.current.innerHTML = '';
        window.twttr.widgets.createTweet(
          tweetId,
          embedRef.current,
          { theme: 'light', conversation: 'none' }
        );
      }
    };

    if (!window.twttr) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.onload = createTweet;
      document.body.appendChild(script);
    } else {
      createTweet();
    }
  }, [tweetId]);

  return <div ref={embedRef} style={{ width: '100%', minHeight: '300px', display: 'flex', justifyContent: 'center' }}></div>;
};

interface ReelCardProps {
  reel: any;
  pageIndex: number;
  status: "REVIEW_COMPLETE" | "UNDER_REVIEW";
}

const ReelCard: React.FC<ReelCardProps> = ({ reel, pageIndex, status }) => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [openNotificationModal, setOpenNotificationModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [pendingApproval, setPendingApproval] = useState<{ reelId: string; notify: boolean } | null>(null);

  const reelId = reel?.id;

  const videoUrl = getVideoUrl(reel);
  const isYouTube = videoUrl ? isYouTubeUrl(videoUrl) : false;
  const isTwitter = videoUrl ? isTwitterUrl(videoUrl) : false;
  const isFacebook = videoUrl ? isFacebookUrl(videoUrl) : false;
  const tweetId = isTwitter && videoUrl ? getTweetId(videoUrl) : null;

  const thumbnailUrl = getThumbnailUrl(reel) || (isYouTube && videoUrl ? getYouTubeThumbnail(videoUrl) : null);

  const videoPlayer = videoUrl ? (
    isYouTube ? (
      <iframe
        width="100%"
        height="100%"
        src={getYouTubeEmbedUrl(videoUrl) || ''}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    ) : isTwitter && tweetId ? (
      <TweetEmbed tweetId={tweetId} />
    ) : isFacebook ? (
      <iframe
        src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(videoUrl)}&show_text=false&width=500&autoplay=true&mute=1`}
        width="500"
        height="400"
        style={{ border: 'none', overflow: 'hidden' }}
        allowFullScreen={true}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      />
    ) : (
      <video style={{ width: "100%", height: "100%" }} controls autoPlay>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    )
  ) : (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f0f0f0", color: "#666" }}>
      Video not available
    </div>
  );

  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);
  const toggleDeleteModal = () => setOpenDeleteModal(!openDeleteModal);
  const toggleRejectModal = () => setOpenRejectModal(!openRejectModal);
  const toggleNotificationModal = () => setOpenNotificationModal(!openNotificationModal);

  // ✅ Updated delete: Move to Trash first, then API delete
  const deleteReel = async () => {
    if (!itemToDelete) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
      toast.error("User not logged in");
      return;
    }

    // 1. Move to trash (localStorage)
    moveToTrash({
      id: itemToDelete,
      type: 'reel',
      data: reel,   // the current reel object
    }, currentUser.username);

    // 2. Delete from server (API)
    try {
      const response = await client.delete(`/reels/${itemToDelete}`);
      if (response.status === 200) {
        toast.success("Reel moved to trash and deleted from server!");
        mutate(`/reels/dashboard?status=REVIEW_COMPLETE&page=${pageIndex}&size=10`);
      } else throw new Error("Delete failed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete reel");
    }
    toggleDeleteModal();
  };

  // ✅ Updated updateReelStatus: now accepts a notify flag
  const updateReelStatus = async (isApproved: boolean, sendNotify: boolean = false) => {
    try {
      const res = await client.post(
        `/reels/${reelId}/approve?isApproved=${isApproved}&notify=${sendNotify}`,
        isApproved ? {} : { rejectionReason: rejectionReason }
      );

      if (res.status === 200) {
        toast.success(`Reel ${isApproved ? "approved" : "rejected"} successfully.`);
        if (sendNotify) {
          toast.info("Notification sent to users.");
        }
        mutate(`/reels/dashboard?status=UNDER_REVIEW&page=${pageIndex}&size=10`);
      } else throw new Error("Status update failed");
    } catch (err) {
      toast.error(`Failed to ${isApproved ? "approve" : "reject"} reel.`);
    }

    if (!isApproved) toggleRejectModal();
    else if (isApproved && sendNotify) toggleNotificationModal(); // close the modal if opened
  };

  const handleApproveClick = () => {
    setPendingApproval({ reelId: reelId, notify: false });
    toggleNotificationModal();
  };

  const handleConfirmApprove = (sendNotify: boolean) => {
    if (pendingApproval) {
      updateReelStatus(true, sendNotify);
      setPendingApproval(null);
    }
    toggleNotificationModal();
  };

  const formatToIST = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const formatted = date.toLocaleString("en-IN", options);
    const [day, month, yearWithComma, time, ampm] = formatted.replace(",", "").split(" ");
    return `${day}/${month}/${yearWithComma} ${time} ${ampm.toUpperCase()}`;
  };

  return (
    <>
      {/* Delete Modal */}
      {openDeleteModal && (
        <Modal
          header="Delete Reel?"
          isOpen={openDeleteModal}
          toggleDialog={toggleDeleteModal}
          action2={{ event: toggleDeleteModal, label: "Cancel" }}
          action1={{ event: deleteReel, label: "Delete" }}
          title="Reel"
        />
      )}

      {/* Reject Modal */}
      {openRejectModal && (
        <RejectionModal
          open={openRejectModal}
          onClose={toggleRejectModal}
          onReject={() => updateReelStatus(false, false)}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
        />
      )}

      {/* Notification Confirmation Modal for Approve */}
      <Dialog open={openNotificationModal} onClose={toggleNotificationModal}>
        <DialogTitle>Send Notification?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to send a push notification to users about this approved reel?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmApprove(false)} color="secondary">
            No
          </Button>
          <Button onClick={() => handleConfirmApprove(true)} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ position: "relative" }}>
        <Card className="bg-light" sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Box sx={{ position: "relative" }}>
            {thumbnailUrl ? (
              <CardMedia
                component="img"
                height="300"
                image={thumbnailUrl}
                alt="Reel Thumbnail"
                sx={{ objectFit: "cover" }}
              />
            ) : (
              <Box
                sx={{
                  height: 300,
                  backgroundColor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'grey.500',
                }}
              >
                <KTIcon iconName="youtube" className="fs-3x" />
              </Box>
            )}
            {!isDialogOpen && videoUrl && (
              <Box
                onClick={toggleDialog}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '50%',
                  width: 70,
                  height: 70,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(3px)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  }
                }}
              >
                {isTwitter ? (
                  <KTIcon iconName="twitter" className="fs-2x text-white" />
                ) : isFacebook ? (
                  <KTIcon iconName="facebook" className="fs-2x text-white" />
                ) : (
                  <PlayCircleOutlineIcon sx={{ fontSize: 60 }} />
                )}
              </Box>
            )}
            {!videoUrl && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  padding: "8px 12px",
                  borderRadius: 1,
                }}
              >
                <Typography variant="caption">Video not available</Typography>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "nowrap",
              gap: 2,
              p: 2,
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                minWidth: 0,
                overflow: "hidden",
                width: status === "UNDER_REVIEW" ? "100%" : "auto",
              }}
            >
              {status === "REVIEW_COMPLETE" ? (
                <Typography
                  variant="h6"
                  gutterBottom
                  title={reel.title || "Untitled Reel"}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "100%",
                    display: "block",
                  }}
                >
                  {reel.title?.length > 20 ? `${reel.title.slice(0, 20)}...` : reel.title || "Untitled Reel"}
                </Typography>
              ) : (
                <>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ maxWidth: "70%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    >
                      {reel.title || "Untitled Reel"}
                    </Typography>
                    {reel?.createdAt && (
                      <Typography variant="caption" color="textSecondary" sx={{ fontSize: "11px", whiteSpace: "nowrap" }}>
                        {formatToIST(reel.createdAt)} IST
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 1, gap: 1.5 }}>
                    <Box
                      component="img"
                      src={reel?.profileImage || "/default-avatar.png"}
                      alt="User"
                      sx={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                    />
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography sx={{ width: "fit-content", maxWidth: "100%", wordBreak: "break-word" }}>
                        {reel.username}
                      </Typography>
                      {reel?.phoneNumber && (
                        <Typography sx={{ fontSize: "13px", color: "#6b7280", mt: 0.4 }}>
                          {reel.phoneNumber}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </>
              )}

              {status === "REVIEW_COMPLETE" && (
                <Box sx={{ mt: 0.5 }}>
                  {reel?.uploadedBy === "admin" ? (
                    <Typography variant="caption" sx={{ backgroundColor: "#e3f2fd", color: "#03214eff", borderRadius: 1, px: 1.5, py: 0.5, fontWeight: 500 }}>
                      Uploaded by Admin
                    </Typography>
                  ) : reel?.isApproved === true ? (
                    <Typography variant="caption" sx={{ backgroundColor: "#d4edda", color: "#155724", borderRadius: 1, px: 1.5, py: 0.5, fontWeight: 500 }}>
                      Approved by Admin
                    </Typography>
                  ) : reel?.isApproved === false ? (
                    <Typography variant="caption" sx={{ backgroundColor: "#f8d7da", color: "#721c24", borderRadius: 1, px: 1.5, py: 0.5, fontWeight: 500 }}>
                      Rejected by Admin
                    </Typography>
                  ) : null}
                </Box>
              )}

              {status === "UNDER_REVIEW" && (
                <Box sx={{ mt: 1, display: "flex", gap: 2 }}>
                  <Button variant="contained" color="success" size="small" onClick={handleApproveClick}>
                    Approve
                  </Button>
                  <Button variant="outlined" color="error" size="small" onClick={toggleRejectModal}>
                    Reject
                  </Button>
                </Box>
              )}
            </Box>

            {status === "REVIEW_COMPLETE" && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center", justifyContent: "flex-end", minWidth: 100, flexShrink: 0 }}>
                {reel?.uploadedBy === "admin" && (
                  <a onClick={() => navigate(`/reels/create/${reelId}`)} className="btn btn-bg-light btn-color-danger p-1 btn-icon btn-outline" style={{ backgroundColor: "#FFFFFF00", cursor: "pointer" }} title="Edit Reel">
                    <KTIcon iconName="pencil" className="fs-2 text-primary" />
                  </a>
                )}
                <a onClick={() => { setItemToDelete(reelId); toggleDeleteModal(); }} className="btn btn-bg-light btn-color-danger p-1 btn-icon btn-outline" style={{ backgroundColor: "#FFFFFF00", cursor: "pointer" }} title="Delete Reel">
                  <KTIcon iconName="trash" className="fs-2 text-danger" />
                </a>
              </Box>
            )}
          </Box>
        </Card>
      </Box>

      <VideoModal
        toggleModal={toggleDialog}
        isOpen={isDialogOpen}
        videoPlayer={videoPlayer}
        title={status === "REVIEW_COMPLETE" ? reel?.title : undefined}
        rejectionReason={reel?.rejectionReason}
      />
    </>
  );
};

export default ReelCard;
