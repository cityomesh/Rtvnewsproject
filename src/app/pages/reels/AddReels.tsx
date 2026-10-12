

// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { createOrUpdateReels, createReelsSchema, initReelsVal } from "./reel";
// import { useEffect, useState } from "react";
// import { useFormik } from "formik";
// import { toast } from "react-toastify";
// import { PageTitle } from "../../../_metronic/layout/core";
// import { KTIcon } from "../../../_metronic/helpers";
// import { uploadVideoAndThumbnail } from "../../modules/service/fileservice";
// import { IReels } from "./reel";
// import { useReel } from "./reel-controller";
// import { uploadSizeLimit } from "../../../utils/UploadSizeLimit";
// import CancelButton from "../../common/cancelButton";
// import "./style.css";
// import { Radio, RadioGroup, FormControlLabel, Typography, Checkbox } from "@mui/material";
// import { extractUrlFromTweetEmbed } from "./Utils";
// import { getCurrentUser } from "../../modules/auth/session";

// // ✅ Helper to get user‑specific drafts storage key for REELS
// const getReelDraftsStorageKey = (): string => {
//   const user = getCurrentUser();
//   if (!user) return "reel_drafts_anonymous";
//   const identifier = user.username || "unknown";
//   return `reel_drafts_${identifier}`;
// };

// export const AddReels = () => {
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const queryParams = new URLSearchParams(location.search);
//   const draftId = queryParams.get("draftId");

//   const [initData, setInitData] = useState<IReels>(initReelsVal);
//   const [loading, setLoading] = useState(false);
//   const [isUploadingVideo, setIsUploadingVideo] = useState<boolean>(false);
//   const [selectedVideoInputType, setSelectedVideoInputType] = useState<"internal" | "external">();
//   const [sendNotification, setSendNotification] = useState(true);
//   const [isDraftMode, setIsDraftMode] = useState(false);
//   const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);

//   // Load reel from API if id exists
//   const { reel: apiReel, isLoading: apiLoading } = useReel(id ?? "", () => { });
//   useEffect(() => {
//     if (id && apiReel) {
//       setInitData(apiReel);
//       setIsDraftMode(false);
//       setCurrentDraftId(null);
//       if (apiReel.video?.externalFile?.url) {
//         setSelectedVideoInputType("external");
//       } else {
//         setSelectedVideoInputType("internal");
//       }
//     }
//   }, [id, apiReel]);

//   // Load draft if draftId exists (and no id) – using user‑specific key
//   useEffect(() => {
//     if (!id && draftId) {
//       const key = getReelDraftsStorageKey();
//       const stored = localStorage.getItem(key);
//       if (stored) {
//         const drafts: any[] = JSON.parse(stored);
//         const draft = drafts.find((d) => d.id === draftId);
//         if (draft) {
//           setInitData(draft);
//           setIsDraftMode(true);
//           setCurrentDraftId(draft.id);
//           if (draft.video?.externalFile?.url) {
//             setSelectedVideoInputType("external");
//           } else {
//             setSelectedVideoInputType("internal");
//           }
//         } else {
//           setInitData(initReelsVal);
//           setIsDraftMode(false);
//           setCurrentDraftId(null);
//           setSelectedVideoInputType("internal");
//         }
//       }
//     } else if (!id && !draftId) {
//       // New reel
//       setInitData(initReelsVal);
//       setIsDraftMode(false);
//       setCurrentDraftId(null);
//       setSelectedVideoInputType("internal");
//     }
//   }, [id, draftId]);

//   // Save draft to user‑specific localStorage (create or update)
//   const saveReelDraftLocally = (values: IReels) => {
//     try {
//       const key = getReelDraftsStorageKey();
//       let existingDrafts = localStorage.getItem(key);
//       let drafts: any[] = existingDrafts ? JSON.parse(existingDrafts) : [];

//       if (currentDraftId) {
//         const index = drafts.findIndex((d) => d.id === currentDraftId);
//         if (index !== -1) {
//           drafts[index] = {
//             ...drafts[index],
//             ...values,
//             updatedAt: new Date().toISOString(),
//           };
//           toast.success("Draft updated successfully!");
//         } else {
//           setCurrentDraftId(null);
//         }
//       }

//       if (!currentDraftId) {
//         const newDraftId = `reel_draft_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
//         const newDraft = {
//           id: newDraftId,
//           ...values,
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         };
//         drafts.push(newDraft);
//         toast.success("Draft saved locally!");
//         setCurrentDraftId(newDraftId);
//       }

//       localStorage.setItem(key, JSON.stringify(drafts));
//       navigate("/reels/drafts");
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to save reel draft.");
//     }
//   };

//   // Publish reel (normal save) – calls API, then deletes draft from user‑specific storage
//   const publishReel = async (values: IReels, draftIdToDelete?: string | null) => {
//     setLoading(true);
//     const submissionValues = JSON.parse(JSON.stringify(values));

//     if (selectedVideoInputType === "internal") {
//       if (submissionValues.video) {
//         submissionValues.video.externalFile = null;
//       }
//     } else if (selectedVideoInputType === "external") {
//       if (submissionValues.video) {
//         submissionValues.video.internalFile = null;
//       }
//     }

//     const notifyParam = "true";

//     await createOrUpdateReels({
//       values: submissionValues,
//       id,
//       notify: notifyParam,
//       onSuccess: (responseData?: any) => {
//         try {
//           console.log("========== CREATE REEL RESPONSE ==========");
//           console.log("Raw response:", responseData);

//         const currentUser = getCurrentUser();
            
//           const creator = currentUser?.username || "unknown";

//           let reelId: string | null = id || null;

//           if (!reelId) {
//             reelId =
//               responseData?.id ||
//               responseData?.data?.id ||
//               responseData?.reel?.id ||
//               responseData?.result?.id ||
//               null;
//           }

//           console.log("Reel ID:", reelId);
//           console.log("Creator:", creator);

//           if (reelId) {
//             const existing = localStorage.getItem("reel_creators");

//             const creators: Record<string, string> = existing
//               ? JSON.parse(existing)
//               : {};

//             creators[reelId] = creator;

//             localStorage.setItem(
//               "reel_creators",
//               JSON.stringify(creators)
//             );

//             console.log("========== REEL CREATOR STORED ==========");
//             console.log(localStorage.getItem("reel_creators"));
//           }

//           // remove draft after publish
//           if (draftIdToDelete) {
//             const key = getReelDraftsStorageKey();

//             const stored = localStorage.getItem(key);

//             if (stored) {
//               const drafts = JSON.parse(stored);

//               const updatedDrafts = drafts.filter(
//                 (d: any) => d.id !== draftIdToDelete
//               );

//               localStorage.setItem(
//                 key,
//                 JSON.stringify(updatedDrafts)
//               );
//             }
//           }

//           toast.success(
//             id
//               ? "Reel updated successfully!"
//               : "Reel created successfully!"
//           );

//           navigate("/reels");
//         } catch (error) {
//           console.error("ERROR INSIDE onSuccess:", error);
//           toast.error("Error after saving reel");
//         }
//       },
//       onError: (e) => toast.error(e),
//       onEnd: () => setLoading(false),
//     });
//   };

//   const formik = useFormik<IReels>({
//     initialValues: initData,
//     validationSchema: createReelsSchema,
//     enableReinitialize: true,
//     onSubmit: (values) => {
//       if (isDraftMode && currentDraftId) {
//         publishReel(values, currentDraftId);
//       } else if (id) {
//         publishReel(values, null);
//       } else {
//         publishReel(values, null);
//       }
//     },
//   });

//   useEffect(() => {
//     if (!id && !draftId && !apiReel) {
//       setSelectedVideoInputType("internal");
//     }
//   }, [id, draftId, apiReel]);

//   const handleVideoTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const type = event.target.value as "internal" | "external";
//     setSelectedVideoInputType(type);
//   };

//   const uploadVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     const file = e.target.files[0];
//     setSelectedVideoInputType("internal");
//     if (!uploadSizeLimit(file.size)) return;
//     setIsUploadingVideo(true);
//     try {
//       const res = await uploadVideoAndThumbnail({
//         file,
//         videoPath: "MEDIA_VIDEOS",
//         thumbnailPath: "MEDIA_IMAGES",
//       });
//       await formik.setFieldValue("video", {
//         ...formik.values.video,
//         internalFile: {
//           video: res.video.url,
//           thumbnail: res.thumbnail.url,
//         },
//       });
//       setSelectedVideoInputType("internal");
//       toast.success("Video uploaded successfully!");
//       setTimeout(() => formik.validateField("video"), 100);
//     } catch (error) {
//       console.error("Video upload error:", error);
//       toast.error("Video upload failed.");
//     } finally {
//       setIsUploadingVideo(false);
//     }
//   };

//   const handleExternalUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     let url = e.target.value;
//     if (url.includes('<blockquote class="twitter-tweet">')) {
//       const extractedUrl = extractUrlFromTweetEmbed(url);
//       if (extractedUrl) url = extractedUrl;
//     }
//     setSelectedVideoInputType("external");
//     formik.setFieldValue("video", {
//       ...formik.values.video,
//       externalFile: { url: url || null },
//     });
//     setTimeout(() => formik.validateField("video"), 100);
//   };

//   return (
//     <>
//       {id ? (
//         <PageTitle description="" breadcrumbs={[]}>Edit Reels</PageTitle>
//       ) : isDraftMode ? (
//         <PageTitle description="" breadcrumbs={[]}>Edit Reel Draft</PageTitle>
//       ) : (
//         <PageTitle description="" breadcrumbs={[]}>Add Reels</PageTitle>
//       )}

//       <div className="card mb-5 mb-xl-10 flexible-reel-container">
//         <div className="card-header border-0 cursor-pointer" role="button">
//           <div className="card-title m-0">
//             <h3 className="fw-bolder m-0">
//               {id ? "Update Reels" : isDraftMode ? "Edit Reel Draft" : "Create Reels"}
//             </h3>
//           </div>
//         </div>

//         <form onSubmit={formik.handleSubmit} noValidate className="form d-flex flex-column h-100">
//           <div className="card-body border-top p-9 reel-form-scrollable">
//             {/* Title Field */}
//             <div className="row mb-6">
//               <label className="col-lg-4 col-form-label required fw-bold fs-6">Title</label>
//               <div className="col-lg-8 fv-row">
//                 <input
//                   type="text"
//                   className="form-control form-control-lg form-control-solid"
//                   placeholder="Title"
//                   {...formik.getFieldProps("title")}
//                 />
//                 <div className="char-count d-flex justify-content-between align-items-center">
//                   {formik.touched.title && formik.errors.title ? (
//                     <div className="fv-help-block error-message mb-0 me-2">{formik.errors.title}</div>
//                   ) : (<div></div>)}
//                   <div>{formik.values.title?.length || 0} / 30</div>
//                 </div>
//               </div>
//             </div>

//             {/* Video Source Radio Buttons */}
//             <div className="row mb-6">
//               <label className="col-lg-4 col-form-label fw-bold fs-6">Video Source</label>
//               <div className="col-lg-8 d-flex align-items-center">
//                 <RadioGroup row value={selectedVideoInputType} onChange={handleVideoTypeChange}>
//                   <FormControlLabel value="internal" control={<Radio />} label="Upload Video" className="me-6" />
//                   <FormControlLabel value="external" control={<Radio />} label="External URL" />
//                 </RadioGroup>
//               </div>
//             </div>

//             {/* Internal Upload Section */}
//             {selectedVideoInputType === "internal" && (
//               <div className="row mb-6">
//                 <label className="col-lg-4 col-form-label required fw-bold fs-6">Upload Video</label>
//                 <div className="col-lg-8 fv-row">
//                   <label htmlFor="file-upload" className="btn btn-sm btn-light-primary w-50 fs-6 p-5">
//                     <KTIcon iconName="file-up" className="fs-2" />
//                     {isUploadingVideo ? "Uploading..." : formik.values.video?.internalFile?.video ? "Change Video" : "Select Video"}
//                   </label>
//                   <input id="file-upload" type="file" onChange={uploadVideo} accept="video/*" disabled={isUploadingVideo} style={{ display: "none" }} />
//                   {formik.touched.video && (formik.errors.video as any)?.internalFile?.video && (
//                     <div className="fv-help-block">{(formik.errors.video as any)?.internalFile?.video}</div>
//                   )}
//                   {formik.values.video?.internalFile?.thumbnail && (
//                     <div className="mt-4">
//                       <div className="symbol symbol-200px me-5">
//                         <img src={formik.values.video.internalFile.thumbnail} alt="Thumbnail preview" style={{ objectFit: "cover", width: "100%", maxWidth: 300 }} />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* External URL Section */}
//             {selectedVideoInputType === "external" && (
//               <div className="row mb-6">
//                 <label className="col-lg-4 col-form-label required fw-bold fs-6">External URL</label>
//                 <div className="col-lg-8 fv-row">
//                   <input
//                     type="text"
//                     className="form-control form-control-lg form-control-solid"
//                     placeholder="Enter external video URL"
//                     value={formik.values.video?.externalFile?.url || ""}
//                     onChange={handleExternalUrlChange}
//                   />
//                   {formik.touched.video && (formik.errors.video as any)?.externalFile?.url && (
//                     <div className="fv-help-block">{(formik.errors.video as any)?.externalFile?.url}</div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Send Notification Section */}
//             <div className="mt-6 mb-6">
//               <FormControlLabel
//                 control={<Checkbox checked={sendNotification} onChange={(e) => setSendNotification(e.target.checked)} name="sendNotification" color="primary" />}
//                 label={<Typography variant="body1" sx={{ fontWeight: 600, fontSize: "1.075rem" }}>Send Notification</Typography>}
//               />
//               <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 4 }}>
//                 Check this to send push notifications to users when the reel is {id ? "updated" : "published"}.
//               </Typography>
//             </div>
//           </div>

//           {/* Footer Actions */}
//           <div className="card-footer-button d-flex justify-content-end py-6 px-9 form-sticky-footer">
//             <CancelButton />
//             {!id && (
//               <button type="button" className="btn btn-secondary me-3" disabled={loading || isUploadingVideo} onClick={() => saveReelDraftLocally(formik.values)}>
//                 Save Draft
//               </button>
//             )}
//             <button type="submit" className="btn btn-primary" disabled={loading || isUploadingVideo}>
//               {!loading ? (id ? "Update" : isDraftMode ? "Publish" : "Save") : "Please wait..."}
//               {loading && <span className="spinner-border spinner-border-sm align-middle ms-2"></span>}
//             </button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };





import { useNavigate, useParams, useLocation } from "react-router-dom";
import { createOrUpdateReels, createReelsSchema, initReelsVal } from "./reel";
import { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { PageTitle } from "../../../_metronic/layout/core";
import { KTIcon } from "../../../_metronic/helpers";
import { uploadVideoAndThumbnail } from "../../modules/service/fileservice";
import { IReels } from "./reel";
import { useReel } from "./reel-controller";
import { uploadSizeLimit } from "../../../utils/UploadSizeLimit";
import CancelButton from "../../common/cancelButton";
import "./style.css";
import { Radio, RadioGroup, FormControlLabel, Typography, Checkbox } from "@mui/material";
import { extractUrlFromTweetEmbed } from "./Utils";
import { getCurrentUser } from "../../modules/auth/session";

// ✅ Helper to get user‑specific drafts storage key for REELS
const getReelDraftsStorageKey = (): string => {
  const user = getCurrentUser();
  if (!user) return "reel_drafts_anonymous";
  const identifier = user.username || "unknown";
  return `reel_drafts_${identifier}`;
};

export const AddReels = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const draftId = queryParams.get("draftId");

  const [initData, setInitData] = useState<IReels>(initReelsVal);
  const [loading, setLoading] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState<boolean>(false);
  const [selectedVideoInputType, setSelectedVideoInputType] = useState<"internal" | "external">();
  const [sendNotification, setSendNotification] = useState(false);
  const [isDraftMode, setIsDraftMode] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);

  // 🆕 Auto‑save state
  const [autoSaveDraftId, setAutoSaveDraftId] = useState<string | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);

  // Load reel from API if id exists
  const { reel: apiReel, isLoading: apiLoading } = useReel(id ?? "", () => { });
  useEffect(() => {
    if (id && apiReel) {
      setInitData(apiReel);
      setIsDraftMode(false);
      setCurrentDraftId(null);
      setAutoSaveDraftId(null);
      if (apiReel.video?.externalFile?.url) {
        setSelectedVideoInputType("external");
      } else {
        setSelectedVideoInputType("internal");
      }
    }
  }, [id, apiReel]);

  // Load draft if draftId exists (and no id) – using user‑specific key
  useEffect(() => {
    if (!id && draftId) {
      const key = getReelDraftsStorageKey();
      const stored = localStorage.getItem(key);
      if (stored) {
        const drafts: any[] = JSON.parse(stored);
        const draft = drafts.find((d) => d.id === draftId);
        if (draft) {
          setInitData(draft);
          setIsDraftMode(true);
          setCurrentDraftId(draft.id);
          setAutoSaveDraftId(draft.id);
          if (draft.video?.externalFile?.url) {
            setSelectedVideoInputType("external");
          } else {
            setSelectedVideoInputType("internal");
          }
        } else {
          setInitData(initReelsVal);
          setIsDraftMode(false);
          setCurrentDraftId(null);
          setAutoSaveDraftId(null);
          setSelectedVideoInputType("internal");
        }
      }
    } else if (!id && !draftId) {
      // New reel
      setInitData(initReelsVal);
      setIsDraftMode(false);
      setCurrentDraftId(null);
      setAutoSaveDraftId(null);
      setSelectedVideoInputType("internal");
    }
  }, [id, draftId]);

  // 🆕 Auto‑save function (captures current values)
  const autoSaveDraft = (values: IReels) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) return; // silently fail

      const key = getReelDraftsStorageKey();
      let existingDrafts = localStorage.getItem(key);
      let drafts: any[] = existingDrafts ? JSON.parse(existingDrafts) : [];

      let targetId = autoSaveDraftId;

      if (targetId) {
        const index = drafts.findIndex((d) => d.id === targetId);
        if (index !== -1) {
          drafts[index] = {
            ...drafts[index],
            ...values,
            updatedAt: new Date().toISOString(),
          };
        } else {
          targetId = null;
        }
      }

      if (!targetId) {
        const newDraftId = `reel_draft_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const newDraft = {
          id: newDraftId,
          ...values,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        drafts.push(newDraft);
        setAutoSaveDraftId(newDraftId);
      }

      localStorage.setItem(key, JSON.stringify(drafts));
      setIsAutoSaving(true);
      toast.info("Draft auto-saved", { autoClose: 1000, hideProgressBar: true });
      setTimeout(() => setIsAutoSaving(false), 1500);
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  };

  // 🆕 Formik declaration (must be before auto‑save useEffect)
  const formik = useFormik<IReels>({
    initialValues: initData,
    validationSchema: createReelsSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      // Clear auto-save timer
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
      if (isDraftMode && currentDraftId) {
        publishReel(values, currentDraftId);
      } else if (id) {
        publishReel(values, null);
      } else {
        publishReel(values, null);
      }
    },
  });

  // 🆕 Auto‑save useEffect – watches formik.values
  useEffect(() => {
    // Only auto-save for new reels (no API id) and when not loading
    if (id || loading) return;

    // Clear previous timer
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    // Check if form has meaningful data (title or video)
    const hasData =
      (formik.values.title && formik.values.title.trim() !== "") ||
      (formik.values.video &&
        (formik.values.video.internalFile?.video ||
          formik.values.video.externalFile?.url));

    if (!hasData) return;

    // Set timer to save after 2 seconds of inactivity
    autoSaveTimer.current = setTimeout(() => {
      autoSaveDraft(formik.values);
    }, 2000);

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [
    formik.values.title,
    formik.values.video,
    id,
    loading,
  ]);

  // Save draft to user‑specific localStorage (create or update) – manual save
  const saveReelDraftLocally = (values: IReels) => {
    // Clear auto-save timer
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    try {
      const key = getReelDraftsStorageKey();
      let existingDrafts = localStorage.getItem(key);
      let drafts: any[] = existingDrafts ? JSON.parse(existingDrafts) : [];

      let targetDraftId = currentDraftId || autoSaveDraftId;

      if (targetDraftId) {
        const index = drafts.findIndex((d) => d.id === targetDraftId);
        if (index !== -1) {
          drafts[index] = {
            ...drafts[index],
            ...values,
            updatedAt: new Date().toISOString(),
          };
          toast.success("Draft updated successfully!");
        } else {
          targetDraftId = null;
        }
      }

      if (!targetDraftId) {
        const newDraftId = `reel_draft_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const newDraft = {
          id: newDraftId,
          ...values,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        drafts.push(newDraft);
        setAutoSaveDraftId(newDraftId);
        toast.success("Draft saved locally!");
      }

      localStorage.setItem(key, JSON.stringify(drafts));
      navigate("/reels/drafts");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save reel draft.");
    }
  };

  // Publish reel (normal save) – calls API, then deletes draft from user‑specific storage
  const publishReel = async (values: IReels, draftIdToDelete?: string | null) => {
    // Clear auto-save timer
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    setLoading(true);
    const submissionValues = JSON.parse(JSON.stringify(values));

    if (selectedVideoInputType === "internal") {
      if (submissionValues.video) {
        submissionValues.video.externalFile = null;
      }
    } else if (selectedVideoInputType === "external") {
      if (submissionValues.video) {
        submissionValues.video.internalFile = null;
      }
    }

    const notifyParam = sendNotification ? "true" : "false";

    await createOrUpdateReels({
      values: submissionValues,
      id,
      notify: notifyParam,
      onSuccess: (responseData?: any) => {
        try {
          console.log("========== CREATE REEL RESPONSE ==========");
          console.log("Raw response:", responseData);

          const currentUser = getCurrentUser();
          const creator = currentUser?.username || "unknown";

          let reelId: string | null = id || null;

          if (!reelId) {
            reelId =
              responseData?.id ||
              responseData?.data?.id ||
              responseData?.reel?.id ||
              responseData?.result?.id ||
              null;
          }

          console.log("Reel ID:", reelId);
          console.log("Creator:", creator);

          if (reelId) {
            const existing = localStorage.getItem("reel_creators");
            const creators: Record<string, string> = existing
              ? JSON.parse(existing)
              : {};
            creators[reelId] = creator;
            localStorage.setItem("reel_creators", JSON.stringify(creators));
            console.log("========== REEL CREATOR STORED ==========");
            console.log(localStorage.getItem("reel_creators"));
          }

          // Delete both manual and auto-save drafts
          const draftIdsToDelete = [
            draftIdToDelete,
            autoSaveDraftId,
          ].filter(Boolean);
          if (draftIdsToDelete.length > 0) {
            const key = getReelDraftsStorageKey();
            const stored = localStorage.getItem(key);
            if (stored) {
              const drafts = JSON.parse(stored);
              const updated = drafts.filter((d: any) => !draftIdsToDelete.includes(d.id));
              localStorage.setItem(key, JSON.stringify(updated));
            }
          }

          toast.success(
            id
              ? "Reel updated successfully!"
              : "Reel created successfully!"
          );

          navigate("/reels");
        } catch (error) {
          console.error("ERROR INSIDE onSuccess:", error);
          toast.error("Error after saving reel");
        }
      },
      onError: (e) => toast.error(e),
      onEnd: () => setLoading(false),
    });
  };

  useEffect(() => {
    if (!id && !draftId && !apiReel) {
      setSelectedVideoInputType("internal");
    }
  }, [id, draftId, apiReel]);

  const handleVideoTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const type = event.target.value as "internal" | "external";
    setSelectedVideoInputType(type);
  };

  const uploadVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setSelectedVideoInputType("internal");
    if (!uploadSizeLimit(file.size)) return;
    setIsUploadingVideo(true);
    try {
      const res = await uploadVideoAndThumbnail({
        file,
        videoPath: "MEDIA_VIDEOS",
        thumbnailPath: "MEDIA_IMAGES",
      });
      await formik.setFieldValue("video", {
        ...formik.values.video,
        internalFile: {
          video: res.video.url,
          thumbnail: res.thumbnail.url,
        },
      });
      setSelectedVideoInputType("internal");
      toast.success("Video uploaded successfully!");
      setTimeout(() => formik.validateField("video"), 100);
    } catch (error) {
      console.error("Video upload error:", error);
      toast.error("Video upload failed.");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleExternalUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let url = e.target.value;
    if (url.includes('<blockquote class="twitter-tweet">')) {
      const extractedUrl = extractUrlFromTweetEmbed(url);
      if (extractedUrl) url = extractedUrl;
    }
    setSelectedVideoInputType("external");
    formik.setFieldValue("video", {
      ...formik.values.video,
      externalFile: { url: url || null },
    });
    setTimeout(() => formik.validateField("video"), 100);
  };

  return (
    <>
      {id ? (
        <PageTitle description="" breadcrumbs={[]}>Edit Reels</PageTitle>
      ) : isDraftMode ? (
        <PageTitle description="" breadcrumbs={[]}>Edit Reel Draft</PageTitle>
      ) : (
        <PageTitle description="" breadcrumbs={[]}>Add Reels</PageTitle>
      )}

      <div className="card mb-5 mb-xl-10 flexible-reel-container">
        <div className="card-header border-0 cursor-pointer" role="button">
          <div className="card-title m-0">
            <h3 className="fw-bolder m-0">
              {id ? "Update Reels" : isDraftMode ? "Edit Reel Draft" : "Create Reels"}
              {isAutoSaving && (
                <span className="badge badge-light-primary ms-3">Auto-saving...</span>
              )}
            </h3>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} noValidate className="form d-flex flex-column h-100">
          <div className="card-body border-top p-9 reel-form-scrollable">
            {/* Title Field */}
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label required fw-bold fs-6">Title</label>
              <div className="col-lg-8 fv-row">
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid"
                  placeholder="Title"
                  {...formik.getFieldProps("title")}
                />
                <div className="char-count d-flex justify-content-between align-items-center">
                  {formik.touched.title && formik.errors.title ? (
                    <div className="fv-help-block error-message mb-0 me-2">{formik.errors.title}</div>
                  ) : (<div></div>)}
                  <div>{formik.values.title?.length || 0} / 30</div>
                </div>
              </div>
            </div>

            {/* Video Source Radio Buttons */}
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label fw-bold fs-6">Video Source</label>
              <div className="col-lg-8 d-flex align-items-center">
                <RadioGroup row value={selectedVideoInputType} onChange={handleVideoTypeChange}>
                  <FormControlLabel value="internal" control={<Radio />} label="Upload Video" className="me-6" />
                  <FormControlLabel value="external" control={<Radio />} label="External URL" />
                </RadioGroup>
              </div>
            </div>

            {/* Internal Upload Section */}
            {selectedVideoInputType === "internal" && (
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">Upload Video</label>
                <div className="col-lg-8 fv-row">
                  <label htmlFor="file-upload" className="btn btn-sm btn-light-primary w-50 fs-6 p-5">
                    <KTIcon iconName="file-up" className="fs-2" />
                    {isUploadingVideo ? "Uploading..." : formik.values.video?.internalFile?.video ? "Change Video" : "Select Video"}
                  </label>
                  <input id="file-upload" type="file" onChange={uploadVideo} accept="video/*" disabled={isUploadingVideo} style={{ display: "none" }} />
                  {formik.touched.video && (formik.errors.video as any)?.internalFile?.video && (
                    <div className="fv-help-block">{(formik.errors.video as any)?.internalFile?.video}</div>
                  )}
                  {formik.values.video?.internalFile?.thumbnail && (
                    <div className="mt-4">
                      <div className="symbol symbol-200px me-5">
                        <img src={formik.values.video.internalFile.thumbnail} alt="Thumbnail preview" style={{ objectFit: "cover", width: "100%", maxWidth: 300 }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* External URL Section */}
            {selectedVideoInputType === "external" && (
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">External URL</label>
                <div className="col-lg-8 fv-row">
                  <input
                    type="text"
                    className="form-control form-control-lg form-control-solid"
                    placeholder="Enter external video URL"
                    value={formik.values.video?.externalFile?.url || ""}
                    onChange={handleExternalUrlChange}
                  />
                  {formik.touched.video && (formik.errors.video as any)?.externalFile?.url && (
                    <div className="fv-help-block">{(formik.errors.video as any)?.externalFile?.url}</div>
                  )}
                </div>
              </div>
            )}

            {/* Send Notification Section */}
            <div className="mt-6 mb-6">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sendNotification}
                      onChange={(e) => setSendNotification(e.target.checked)}
                      name="sendNotification"
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: "1.075rem" }}>
                      {id ? "Send Notification on Update" : "Send Notification on Publish"}
                    </Typography>
                  }
                />
              <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 4 }}>
                Check this to send push notifications to users when the reel is {id ? "updated" : "published"}.
              </Typography>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="card-footer-button d-flex justify-content-end py-6 px-9 form-sticky-footer">
            <CancelButton />
            {!id && (
              <button type="button" className="btn btn-secondary me-3" disabled={loading || isUploadingVideo} onClick={() => saveReelDraftLocally(formik.values)}>
                Save Draft
              </button>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading || isUploadingVideo}>
              {!loading ? (id ? "Update" : isDraftMode ? "Publish" : "Save") : "Please wait..."}
              {loading && <span className="spinner-border spinner-border-sm align-middle ms-2"></span>}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
