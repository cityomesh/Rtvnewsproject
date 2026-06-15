
// import { useNavigate, useParams } from "react-router-dom";
// import { useEffect, useState , useRef} from "react";
// import { useFormik } from "formik";
// import { toast } from "react-toastify";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { KTIcon } from "../../../_metronic/helpers";
// import { uploadFile, uploadVideoAndThumbnail } from "../../modules/service/fileservice";
// import { createPostSchema, initPostVal, IPost } from "./post";
// import { createOrUpdatePost, usePost } from "./post-controller";
// import "./style.css";
// import { maxCharForTextInput, maxCharForDescription } from "./post";
// import { uploadSizeLimit } from "../../../utils/UploadSizeLimit";
// import CancelButton from "../../common/cancelButton";
// // MUI components for notification checkbox
// import { Typography, FormControlLabel, Checkbox } from "@mui/material";
// import { getCurrentUser } from  "../../modules/auth/session.ts";

// export const AddPost = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const quillRef = useRef<ReactQuill>(null);

//   const [loading, setLoading] = useState(false);
//   const [isUploadingImage, setIsUploadingImage] = useState(false);
//   const [isUploadingVideo, setIsUploadingVideo] = useState(false);
//   const [selectedMediaType, setSelectedMediaType] = useState<"image" | "video">("image");
//   const [selectedVideoInputType, setSelectedVideoInputType] = useState<"internal" | "external" | null>(null);
//   const [descriptionCharCount, setDescriptionCharCount] = useState(0);
//   const [sendNotification, setSendNotification] = useState(false);
//   const [initData, setInitData] = useState<IPost>(initPostVal);
//   const [isInitialLoad, setIsInitialLoad] = useState(true);

//   useEffect(() => {
//     if (quillRef.current) {
//       const editor = quillRef.current.getEditor();
//       const Delta = (editor.constructor as any).import('delta');
      
//       editor.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
//         if (delta?.ops) {
//           delta.ops = delta.ops.filter(op => {
//             if (op.insert && typeof op.insert === 'object') return false;
//             if (op.attributes) {
//               delete op.attributes.color;
//               delete op.attributes.background;
//               delete op.attributes.code;
//               delete op.attributes["code-block"];
//             }
//             return true;
//           });
//         }
//         return delta;
//       });

//       ['PRE', 'IMG', 'IFRAME', 'VIDEO', 'EMBED', 'CODE'].forEach(tag => {
//         editor.clipboard.addMatcher(tag, (node) => 
//           tag === 'CODE' ? new Delta().insert(node.textContent || '') : new Delta()
//         );
//       });
//     }
//   }, []);

//   useEffect(() => {
//     setIsInitialLoad(true);
//   }, [id]);

//   usePost(id ?? "", (e) => {
//     if (isInitialLoad) {
//       if (id) {
//         setInitData(e);
//         if (e.video?.internalFile?.video || e.video?.externalFile?.url) {
//           setSelectedMediaType("video");
//           setSelectedVideoInputType(e.video.internalFile?.video ? "internal" : "external");
//         } else {
//           setSelectedMediaType("image");
//           setSelectedVideoInputType(null);
//         }
//       } else {
//         setInitData(initPostVal);
//         setSelectedMediaType("image");
//         setSelectedVideoInputType(null);
//       }
//       setIsInitialLoad(false);
//     }
//   });

//   const stripHTMLTags = (text: any) => {
//     return text ? text.replace(/<\/?[^>]+(>|$)/g, "") : "";
//   };

//   const formik = useFormik<IPost>({
//     initialValues: initData,
//     validationSchema: createPostSchema,
//     validateOnMount: true,
//     enableReinitialize: true,
//     onSubmit: async (values) => {
//       setLoading(true);
//       const sanitizedValues = { ...values, title: stripHTMLTags(values.title) };
//       const notifyParam = sendNotification ? "true" : "false";

//       await createOrUpdatePost({
//         values: sanitizedValues,
//         id,
//         notify: notifyParam,
//         onSuccess: (responseData?: any) => {
//           toast.success("Post saved!");
          
//           // ✅ Store post creator in localStorage (similar to news, quiz)
//           const currentUser = getCurrentUser();
//           const creator = currentUser?.username || 'unknown';
//           const postId = responseData?.id || (id ? id : responseData?.id);
          
//           if (postId && !id) {  // Only for new post (not edit)
//             const existing = localStorage.getItem('post_creators');
//             const creators = existing ? JSON.parse(existing) : {};
//             creators[postId] = creator;
//             localStorage.setItem('post_creators', JSON.stringify(creators));
//             console.log(`Stored post creator: ${postId} -> ${creator}`);
//           }
          
//           navigate("/posts");
//         },
//         onError: (err) => toast.error(err),
//         onEnd: () => setLoading(false),
//       });
//     },
//   });

//   const handleMediaTypeChange = (type: "image" | "video") => {
//     setSelectedMediaType(type);
//     if (type === "image") {
//       formik.setFieldValue("video", initPostVal.video);
//       setSelectedVideoInputType(null);
//     } else {
//       formik.setFieldValue("bannerImage", null);
//       setSelectedVideoInputType("internal");
//     }
//   };

//   const handleVideoSourceChange = (type: "internal" | "external") => {
//     setSelectedVideoInputType(type);
//     if (type === "internal") {
//       formik.setFieldValue("video.externalFile", initPostVal.video.externalFile);
//     } else if (type === "external") {
//       formik.setFieldValue("video.internalFile", initPostVal.video.internalFile);
//     }
//   };

//   const uploadImage = async (e: any) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setIsUploadingImage(true);
//     await uploadFile({
//       file,
//       type: "MEDIA_IMAGES",
//       onSuccess: (res: any) => {
//         formik.setFieldValue("bannerImage", res.url);
//         formik.setFieldValue("video", initPostVal.video);
//         setSelectedMediaType("image");
//         toast.success("Image uploaded successfully!");
//       },
//       onError: (_, message) => toast.error(message || "Something went wrong!"),
//     });
//     setIsUploadingImage(false);
//   };

//   const uploadVideo = async (e: any) => {
//     const file = e.target.files[0];
//     if (!file || !uploadSizeLimit(file.size)) return;
//     setIsUploadingVideo(true);
//     await uploadVideoAndThumbnail({
//       file,
//       videoPath: "MEDIA_VIDEOS",
//       thumbnailPath: "MEDIA_IMAGES",
//       onSuccess: (res: any) => {
//         formik.setFieldValue("video.internalFile", {
//           video: res.video.url,
//           thumbnail: res.thumbnail.url,
//         });
//         formik.setFieldValue("video.externalFile", null);
//         formik.setFieldValue("bannerImage", null);
//         setSelectedMediaType("video");
//         setSelectedVideoInputType("internal");
//         toast.success("Video uploaded successfully!");
//       },
//       onError: (_, message) => toast.error(message || "Something went wrong!"),
//     });
//     setIsUploadingVideo(false);
//   };

//   useEffect(() => {
//     const charCount = stripHTMLTags(formik.values.description || "").length;
//     setDescriptionCharCount(charCount);
//   }, [formik.values.description]);

//   return (
//     <>
//       <div className="card mb-5 mb-xl-10 flexible-post-container">
//         <div className="card-header border-0 cursor-pointer">
//           <div className="card-title m-0">
//             <h3 className="fw-bolder m-0">{id ? "Edit Post" : "Add Post"}</h3>
//           </div>
//         </div>

//         <form onSubmit={formik.handleSubmit} noValidate className="form d-flex flex-column h-100">
//           <div className="card-body border-top p-9 post-form-scrollable">
//             <div className="row mb-6">
//               <label className="col-lg-4 col-form-label required fw-bold fs-6">
//                 Title ({stripHTMLTags(formik.values.title).length}/{maxCharForTextInput})
//               </label>
//               <div className="col-lg-8 fv-row">
//                 <input
//                   type="text"
//                   className="form-control form-control-lg form-control-solid"
//                   placeholder="Title"
//                   maxLength={maxCharForTextInput}
//                   {...formik.getFieldProps("title")}
//                 />
//                 {formik.touched?.title && formik.errors?.title && (
//                   <div className="fv-plugins-message-container"><div className="fv-help-block">{formik.errors?.title}</div></div>
//                 )}
//               </div>
//             </div>

//             <div className="row mb-6">
//               <label className="col-lg-4 col-form-label fw-bold fs-6">Select Media Type</label>
//               <div className="col-lg-8 d-flex gap-3">
//                 <label><input type="radio" name="mediaType" value="image" checked={selectedMediaType === "image"} onChange={() => handleMediaTypeChange("image")}/> Banner Image</label>
//                 <label><input type="radio" name="mediaType" value="video" checked={selectedMediaType === "video"} onChange={() => handleMediaTypeChange("video")}/> Video</label>
//               </div>
//             </div>

//             {selectedMediaType === "image" && (
//               <div className="row mb-6">
//                 <label className="col-lg-4 col-form-label fw-bold fs-6">Upload Banner Image</label>
//                 <div className="col-lg-8 fv-row">
//                   <label htmlFor="image-upload" className="btn btn-light-primary w-50 fs-6 p-5">
//                     <KTIcon iconName="file-up" className="fs-2" />
//                     {isUploadingImage ? "Uploading..." : formik.values.bannerImage ? "Re-Select Image" : "Select Image"}
//                   </label>
//                   <input id="image-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={uploadImage} disabled={isUploadingImage} />
//                   {formik.values.bannerImage && (<div className="mt-3"><img src={formik.values.bannerImage} width="200" alt="Banner" /></div>)}
//                 </div>
//               </div>
//             )}

//             {selectedMediaType === "video" && (
//               <>
//                 <div className="row mb-6">
//                   <label className="col-lg-4 col-form-label fw-bold fs-6">Video Source</label>
//                   <div className="col-lg-8 d-flex gap-3">
//                     <label>
//                       <input type="radio" name="videoSource" value="internal" checked={selectedVideoInputType === "internal"} onChange={() => handleVideoSourceChange("internal")} />
//                       {" "} Upload Video
//                     </label>
//                     <label>
//                       <input type="radio" name="videoSource" value="external" checked={selectedVideoInputType === "external"} onChange={() => handleVideoSourceChange("external")} />
//                       {" "} External URL
//                     </label>
//                   </div>
//                 </div>

//                 {selectedVideoInputType === "internal" && (
//                   <div className="row mb-6">
//                     <label className="col-lg-4 col-form-label fw-bold fs-6">Upload Video</label>
//                     <div className="col-lg-8 fv-row">
//                       <label htmlFor="video-upload" className="btn btn-light-primary w-50 fs-6 p-5">
//                         <KTIcon iconName="file-up" className="fs-2" />
//                         {isUploadingVideo ? "Uploading..." : formik.values.video?.internalFile?.video ? "Re-Select Video" : "Select Video"}
//                       </label>
//                       <input id="video-upload" type="file" accept="video/*" onChange={uploadVideo} disabled={isUploadingVideo} style={{ display: "none" }} />
//                       {formik.values.video?.internalFile?.thumbnail && (
//                         <div className="mt-3">
//                           <img src={formik.values.video.internalFile.thumbnail} width="200" alt="Video thumbnail" />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {selectedVideoInputType === "external" && (
//                   <div className="row mb-6">
//                     <label className="col-lg-4 col-form-label fw-bold fs-6">Video URL</label>
//                     <div className="col-lg-8 fv-row">
//                       <input
//                         type="text"
//                         className="form-control form-control-lg form-control-solid"
//                         placeholder="https://"
//                         {...formik.getFieldProps("video.externalFile.url")}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}

//             <div className="row mb-6">
//               <label className="col-lg-4 col-form-label fw-bold fs-6">Description</label>
//               <div className="col-lg-8 fv-row">
//                 <ReactQuill
//                   ref={quillRef}
//                   theme="snow"
//                   value={formik.values.description}
//                   onChange={(value) => {
//                     formik.setFieldTouched("description", true, false);
//                     formik.setFieldValue("description", value, true);
//                     const plainText = value.replace(/<\/?[^>]+(>|$)/g, "");
//                     setDescriptionCharCount(plainText.trim().length);
//                   }}
//                   placeholder={`Enter description (Max ${maxCharForDescription} characters)`}
//                   className="form-control form-control-lg form-control-solid"
//                   modules={{
//                     clipboard: {
//                       matchVisual: false,
//                     },
//                   }}
//                 />
//                 <div className={`mt-2 ${descriptionCharCount > maxCharForDescription ? "text-danger" : "text-muted"}`}>
//                   Characters: {descriptionCharCount} / {maxCharForDescription}
//                 </div>
//                 {formik.touched.description && formik.errors.description && (
//                   <div className="fv-plugins-message-container"><div className="fv-help-block">{formik.errors.description}</div></div>
//                 )}
//               </div>
//             </div>

//             {/* Send Notification Section */}
//             <div className="mt-6 mb-6">
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={sendNotification}
//                     onChange={(e) => setSendNotification(e.target.checked)}
//                     name="sendNotification"
//                     color="primary"
//                   />
//                 }
//                 label={
//                   <Typography variant="body1" sx={{ fontWeight: 600, fontSize: "1.075rem" }}>
//                     Send Notification
//                   </Typography>
//                 }
//               />
//               <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 4 }}>
//                 Check this to send push notifications to users when the post is {id ? "updated" : "published"}.
//               </Typography>
//             </div>
//           </div>

//           <div className="card-footer-button d-flex justify-content-end py-6 px-9">
//             <CancelButton />
//             <button
//               type="submit"
//               className="btn btn-primary"
//               disabled={!formik.isValid || loading || formik.isSubmitting}
//             >
//               {loading ? "Saving..." : id ? "Update Post" : "Add Post"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };




import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState , useRef} from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { KTIcon } from "../../../_metronic/helpers";
import { uploadFile, uploadVideoAndThumbnail } from "../../modules/service/fileservice";
import { createPostSchema, initPostVal, IPost } from "./post";
import { createOrUpdatePost, usePost } from "./post-controller";
import "./style.css";
import { maxCharForTextInput, maxCharForDescription } from "./post";
import { uploadSizeLimit } from "../../../utils/UploadSizeLimit";
import CancelButton from "../../common/cancelButton";
// MUI components for notification checkbox
import { Typography, FormControlLabel, Checkbox } from "@mui/material";
import { getCurrentUser } from "../../modules/auth/session.ts";

const DRAFTS_STORAGE_KEY = "post_drafts";

export const AddPost = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const draftId = queryParams.get("draftId");

  const quillRef = useRef<ReactQuill>(null);

  const [loading, setLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [selectedMediaType, setSelectedMediaType] = useState<"image" | "video">("image");
  const [selectedVideoInputType, setSelectedVideoInputType] = useState<"internal" | "external" | null>(null);
  const [descriptionCharCount, setDescriptionCharCount] = useState(0);
  const [sendNotification, setSendNotification] = useState(false);
  const [initData, setInitData] = useState<IPost>(initPostVal);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isDraftMode, setIsDraftMode] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);

  // ========== API post editing (id) ==========
  const { post: apiPost, isLoading: apiLoading } = usePost(id ?? "", () => {});
  useEffect(() => {
    if (id && apiPost) {
      setInitData(apiPost);
      setIsDraftMode(false);
      setCurrentDraftId(null);
      if (apiPost.video?.internalFile?.video || apiPost.video?.externalFile?.url) {
        setSelectedMediaType("video");
        setSelectedVideoInputType(apiPost.video.internalFile?.video ? "internal" : "external");
      } else {
        setSelectedMediaType("image");
        setSelectedVideoInputType(null);
      }
      setIsInitialLoad(false);
    }
  }, [id, apiPost]);

  // ========== Loading a draft ==========
  useEffect(() => {
    if (!id && draftId) {
      const stored = localStorage.getItem(DRAFTS_STORAGE_KEY);
      if (stored) {
        const drafts: any[] = JSON.parse(stored);
        const draft = drafts.find((d) => d.id === draftId);
        if (draft) {
          setInitData(draft);
          setIsDraftMode(true);
          setCurrentDraftId(draft.id);
          if (draft.video?.internalFile?.video || draft.video?.externalFile?.url) {
            setSelectedMediaType("video");
            setSelectedVideoInputType(draft.video.internalFile?.video ? "internal" : "external");
          } else {
            setSelectedMediaType("image");
            setSelectedVideoInputType(null);
          }
        } else {
          setInitData(initPostVal);
          setIsDraftMode(false);
          setCurrentDraftId(null);
          setSelectedMediaType("image");
        }
      }
    } else if (!id && !draftId) {
      setInitData(initPostVal);
      setIsDraftMode(false);
      setCurrentDraftId(null);
      setSelectedMediaType("image");
    }
  }, [id, draftId]);

  // Quill editor setup (unchanged)
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const Delta = (editor.constructor as any).import('delta');
      
      editor.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
        if (delta?.ops) {
          delta.ops = delta.ops.filter(op => {
            if (op.insert && typeof op.insert === 'object') return false;
            if (op.attributes) {
              delete op.attributes.color;
              delete op.attributes.background;
              delete op.attributes.code;
              delete op.attributes["code-block"];
            }
            return true;
          });
        }
        return delta;
      });

      ['PRE', 'IMG', 'IFRAME', 'VIDEO', 'EMBED', 'CODE'].forEach(tag => {
        editor.clipboard.addMatcher(tag, (node) => 
          tag === 'CODE' ? new Delta().insert(node.textContent || '') : new Delta()
        );
      });
    }
  }, []);

  // ========== Save draft to localStorage ==========
  const savePostDraftLocally = (values: IPost) => {
    try {
      let existingDrafts = localStorage.getItem(DRAFTS_STORAGE_KEY);
      let drafts: any[] = existingDrafts ? JSON.parse(existingDrafts) : [];

      if (currentDraftId) {
        const index = drafts.findIndex((d) => d.id === currentDraftId);
        if (index !== -1) {
          drafts[index] = {
            ...drafts[index],
            ...values,
            updatedAt: new Date().toISOString(),
          };
          toast.success("Draft updated successfully!");
        } else {
          setCurrentDraftId(null);
        }
      }

      if (!currentDraftId) {
        const newDraftId = `post_draft_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const newDraft = {
          id: newDraftId,
          ...values,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        drafts.push(newDraft);
        toast.success("Draft saved locally!");
        setCurrentDraftId(newDraftId);
      }

      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
      navigate("/post/drafts");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save post draft.");
    }
  };

  // ========== Publish post (API call) and delete draft if any ==========
  const publishPost = async (values: IPost, draftIdToDelete?: string | null) => {
    setLoading(true);
    const sanitizedValues = { ...values, title: stripHTMLTags(values.title) };
    const notifyParam = sendNotification ? "true" : "false";

    await createOrUpdatePost({
      values: sanitizedValues,
      id,
      notify: notifyParam,
      onSuccess: (responseData?: any) => {
        toast.success("Post saved!");
        const currentUser = getCurrentUser();
        const creator = currentUser?.username || 'unknown';
        let postId = id;
        if (!id && responseData?.id) {
          postId = responseData.id;
        }
        if (postId) {
          const existing = localStorage.getItem('post_creators');
          const creators = existing ? JSON.parse(existing) : {};
          creators[postId] = creator;
          localStorage.setItem('post_creators', JSON.stringify(creators));
          console.log(`Stored post creator: ${postId} -> ${creator}`);
        }
        // If this was a draft, delete the draft from localStorage
        if (draftIdToDelete) {
          const stored = localStorage.getItem(DRAFTS_STORAGE_KEY);
          if (stored) {
            const drafts = JSON.parse(stored);
            const updated = drafts.filter((d: any) => d.id !== draftIdToDelete);
            localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updated));
          }
        }
        navigate("/posts");
      },
      onError: (err) => toast.error(err),
      onEnd: () => setLoading(false),
    });
  };

  const stripHTMLTags = (text: any) => {
    return text ? text.replace(/<\/?[^>]+(>|$)/g, "") : "";
  };

  const formik = useFormik<IPost>({
    initialValues: initData,
    validationSchema: createPostSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (isDraftMode && currentDraftId) {
        publishPost(values, currentDraftId);
      } else if (id) {
        publishPost(values, null);
      } else {
        publishPost(values, null);
      }
    },
  });

  // Handlers (unchanged)
  const handleMediaTypeChange = (type: "image" | "video") => {
    setSelectedMediaType(type);
    if (type === "image") {
      formik.setFieldValue("video", initPostVal.video);
      setSelectedVideoInputType(null);
    } else {
      formik.setFieldValue("bannerImage", null);
      setSelectedVideoInputType("internal");
    }
  };

  const handleVideoSourceChange = (type: "internal" | "external") => {
    setSelectedVideoInputType(type);
    if (type === "internal") {
      formik.setFieldValue("video.externalFile", initPostVal.video.externalFile);
    } else if (type === "external") {
      formik.setFieldValue("video.internalFile", initPostVal.video.internalFile);
    }
  };

  const uploadImage = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingImage(true);
    await uploadFile({
      file,
      type: "MEDIA_IMAGES",
      onSuccess: (res: any) => {
        formik.setFieldValue("bannerImage", res.url);
        formik.setFieldValue("video", initPostVal.video);
        setSelectedMediaType("image");
        toast.success("Image uploaded successfully!");
      },
      onError: (_, message) => toast.error(message || "Something went wrong!"),
    });
    setIsUploadingImage(false);
  };

  const uploadVideo = async (e: any) => {
    const file = e.target.files[0];
    if (!file || !uploadSizeLimit(file.size)) return;
    setIsUploadingVideo(true);
    await uploadVideoAndThumbnail({
      file,
      videoPath: "MEDIA_VIDEOS",
      thumbnailPath: "MEDIA_IMAGES",
      onSuccess: (res: any) => {
        formik.setFieldValue("video.internalFile", {
          video: res.video.url,
          thumbnail: res.thumbnail.url,
        });
        formik.setFieldValue("video.externalFile", null);
        formik.setFieldValue("bannerImage", null);
        setSelectedMediaType("video");
        setSelectedVideoInputType("internal");
        toast.success("Video uploaded successfully!");
      },
      onError: (_, message) => toast.error(message || "Something went wrong!"),
    });
    setIsUploadingVideo(false);
  };

  useEffect(() => {
    const charCount = stripHTMLTags(formik.values.description || "").length;
    setDescriptionCharCount(charCount);
  }, [formik.values.description]);

  // ========== Render ==========
  return (
    <>
      <div className="card mb-5 mb-xl-10 flexible-post-container">
        <div className="card-header border-0 cursor-pointer">
          <div className="card-title m-0">
            <h3 className="fw-bolder m-0">
              {id ? "Edit Post" : isDraftMode ? "Edit Post Draft" : "Add Post"}
            </h3>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} noValidate className="form d-flex flex-column h-100">
          <div className="card-body border-top p-9 post-form-scrollable">
            {/* Title */}
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label required fw-bold fs-6">
                Title ({stripHTMLTags(formik.values.title).length}/{maxCharForTextInput})
              </label>
              <div className="col-lg-8 fv-row">
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid"
                  placeholder="Title"
                  maxLength={maxCharForTextInput}
                  {...formik.getFieldProps("title")}
                />
                {formik.touched?.title && formik.errors?.title && (
                  <div className="fv-plugins-message-container"><div className="fv-help-block">{formik.errors?.title}</div></div>
                )}
              </div>
            </div>

            {/* Media Type */}
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label fw-bold fs-6">Select Media Type</label>
              <div className="col-lg-8 d-flex gap-3">
                <label>
                  <input type="radio" name="mediaType" value="image" checked={selectedMediaType === "image"} onChange={() => handleMediaTypeChange("image")}/> Banner Image
                </label>
                <label>
                  <input type="radio" name="mediaType" value="video" checked={selectedMediaType === "video"} onChange={() => handleMediaTypeChange("video")}/> Video
                </label>
              </div>
            </div>

            {/* Image Upload */}
            {selectedMediaType === "image" && (
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">Upload Banner Image</label>
                <div className="col-lg-8 fv-row">
                  <label htmlFor="image-upload" className="btn btn-light-primary w-50 fs-6 p-5">
                    <KTIcon iconName="file-up" className="fs-2" />
                    {isUploadingImage ? "Uploading..." : formik.values.bannerImage ? "Re-Select Image" : "Select Image"}
                  </label>
                  <input id="image-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={uploadImage} disabled={isUploadingImage} />
                  {formik.values.bannerImage && (<div className="mt-3"><img src={formik.values.bannerImage} width="200" alt="Banner" /></div>)}
                </div>
              </div>
            )}

            {/* Video Upload */}
            {selectedMediaType === "video" && (
              <>
                <div className="row mb-6">
                  <label className="col-lg-4 col-form-label fw-bold fs-6">Video Source</label>
                  <div className="col-lg-8 d-flex gap-3">
                    <label>
                      <input type="radio" name="videoSource" value="internal" checked={selectedVideoInputType === "internal"} onChange={() => handleVideoSourceChange("internal")} />
                      {" "} Upload Video
                    </label>
                    <label>
                      <input type="radio" name="videoSource" value="external" checked={selectedVideoInputType === "external"} onChange={() => handleVideoSourceChange("external")} />
                      {" "} External URL
                    </label>
                  </div>
                </div>

                {selectedVideoInputType === "internal" && (
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">Upload Video</label>
                    <div className="col-lg-8 fv-row">
                      <label htmlFor="video-upload" className="btn btn-light-primary w-50 fs-6 p-5">
                        <KTIcon iconName="file-up" className="fs-2" />
                        {isUploadingVideo ? "Uploading..." : formik.values.video?.internalFile?.video ? "Re-Select Video" : "Select Video"}
                      </label>
                      <input id="video-upload" type="file" accept="video/*" onChange={uploadVideo} disabled={isUploadingVideo} style={{ display: "none" }} />
                      {formik.values.video?.internalFile?.thumbnail && (
                        <div className="mt-3">
                          <img src={formik.values.video.internalFile.thumbnail} width="200" alt="Video thumbnail" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedVideoInputType === "external" && (
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">Video URL</label>
                    <div className="col-lg-8 fv-row">
                      <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="https://"
                        {...formik.getFieldProps("video.externalFile.url")}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Description */}
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label fw-bold fs-6">Description</label>
              <div className="col-lg-8 fv-row">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={formik.values.description}
                  onChange={(value) => {
                    formik.setFieldTouched("description", true, false);
                    formik.setFieldValue("description", value, true);
                    const plainText = value.replace(/<\/?[^>]+(>|$)/g, "");
                    setDescriptionCharCount(plainText.trim().length);
                  }}
                  placeholder={`Enter description (Max ${maxCharForDescription} characters)`}
                  className="form-control form-control-lg form-control-solid"
                  modules={{
                    clipboard: {
                      matchVisual: false,
                    },
                  }}
                />
                <div className={`mt-2 ${descriptionCharCount > maxCharForDescription ? "text-danger" : "text-muted"}`}>
                  Characters: {descriptionCharCount} / {maxCharForDescription}
                </div>
                {formik.touched.description && formik.errors.description && (
                  <div className="fv-plugins-message-container"><div className="fv-help-block">{formik.errors.description}</div></div>
                )}
              </div>
            </div>

            {/* Send Notification */}
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
                    Send Notification
                  </Typography>
                }
              />
              <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 4 }}>
                Check this to send push notifications to users when the post is {id ? "updated" : "published"}.
              </Typography>
            </div>
          </div>

          <div className="card-footer-button d-flex justify-content-end py-6 px-9">
            <CancelButton />
            {/* Save Draft button – only when not editing a published post */}
            {!id && (
              <button
                type="button"
                className="btn btn-secondary me-3"
                disabled={loading}
                onClick={() => savePostDraftLocally(formik.values)}
              >
                Save Draft
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!formik.isValid || loading || formik.isSubmitting}
            >
              {loading ? "Saving..." : id ? "Update Post" : isDraftMode ? "Publish" : "Add Post"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
