import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";

import { newsArticleSchema, newsArticleInitialValues, INewsArticlePayload,
} from "./CreateNewsFormDetails.ts";
import {Typography, FormControlLabel, Checkbox, Radio, RadioGroup, FormControl, InputLabel, Select, MenuItem} from "@mui/material";
import client from "../../../modules/service/network.ts";
import fileService, { uploadVideoAndThumbnail} from "../../../modules/service/fileservice.tsx";
import { KTIcon } from "../../../../_metronic/helpers";
import { uploadSizeLimit } from "../../../../utils/UploadSizeLimit.ts";
import { getCurrentUser } from "../../../modules/auth/session.ts";

interface IDistrict {
  name: string;
  id: string;
}

interface ICategory {
  id: number;
  label: string;
}

const NewsFormDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [initData, setInitData] = useState<INewsArticlePayload>(newsArticleInitialValues);
  const [selectedMediaType, setSelectedMediaType] = useState<"image" | "video">("image");
  const [selectedVideoInputType, setSelectedVideoInputType] = useState<"internal" | "external" | null>(null);
  const [sendNotification, setSendNotification] = useState(false);
  const [descriptionCharCount, setDescriptionCharCount] = useState(0);
  const [isTitleAndDescNull, setIsTitleAndDescNull] = useState(true);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    client
      .get("/district")
      .then((response) => {
        setDistricts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching districts:", error);
        toast.error("Failed to fetch districts.");
      });

    client
      .get("/news/category")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories.");
      });
  }, []);

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const Delta = (editor.constructor as any).import("delta");

      editor.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
        if (delta?.ops) {
          delta.ops = delta.ops.filter((op) => {
            if (op.insert && typeof op.insert === "object") return false;
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
      ["PRE", "IMG", "IFRAME", "VIDEO", "EMBED", "CODE"].forEach((tag) => {
        editor.clipboard.addMatcher(tag, (node) =>
          tag === "CODE"
            ? new Delta().insert(node.textContent || "")
            : new Delta()
        );
      });
    }
  }, []);

  useEffect(() => {
    if (id) {
      setLoading(true);
      client
        .get(`news/${id}`)
        .then((response) => {
          const data = response.data;
          if (!data.video) {
            data.video = newsArticleInitialValues.video;
          }
          setInitData(data);
          if (quillRef.current) {
            const editor = quillRef.current.getEditor();
            setDescriptionCharCount(editor.getText().trim().length);
          }
          if (
            data.video &&
            (data.video?.internalFile?.video || data.video?.externalFile?.url)
          ) {
            setSelectedMediaType("video");
            if (data.video.internalFile?.video)
              setSelectedVideoInputType("internal");
            if (data.video.externalFile?.url)
              setSelectedVideoInputType("external");
          } else {
            setSelectedMediaType("image");
          }
          setLoading(false);
        })
        .catch((e) => {
          console.error("Error fetching news details:", e);
          setLoading(false);
          toast.error("Failed to fetch news details.");
        });
    } else {
      setInitData(newsArticleInitialValues);
      setSelectedMediaType("image");
    }
  }, [id]);

  const formik = useFormik<INewsArticlePayload>({
    initialValues: initData,
    validationSchema: () => newsArticleSchema(quillRef, selectedMediaType),
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
          toast.error('Please login again');
          navigate('/login');
          return;
        }
        
        const notifyParam = sendNotification ? "notify=true" : "notify=false";
        const payload = { ...values, storyCards: null };
        console.log("Submitting payload:", payload);
        console.log("Current user:", currentUser);
        
        if (payload.title == "") payload.title = null;
        if (payload.description == "<p><br></p>") payload.description = null;
        if(payload.categoryType == "") payload.categoryType = null;
        if(payload.district == "") payload.district = null;
        
        // Add createdBy field
        const finalPayload = {
          ...payload,
          createdBy: currentUser.username
        };
        
        // Get token - use whatever token is in localStorage
        let token = localStorage.getItem('token');
        const ktAuth = localStorage.getItem('kt-auth-react-v');
        if (!token && ktAuth) {
          try {
            const parsed = JSON.parse(ktAuth);
            token = parsed.api_token;
          } catch(e) {}
        }
        
        if (!token) {
          toast.error('Authentication failed. Please login again.');
          navigate('/login');
          return;
        }
        
        console.log("Using token:", token.substring(0, 30) + "...");
        
        const response = id
          ? await client.put(`/news/${id}?${notifyParam}`, finalPayload, {
              headers: { 'Authorization': `Bearer ${token}` }
            })
          : await client.post(`/news?${notifyParam}`, finalPayload, {
              headers: { 'Authorization': `Bearer ${token}` }
            });

        if (response.status >= 200 && response.status < 300) {
          toast.success(`News Article ${id ? "updated" : "created"} successfully!`);
          
          // 🆕 Store creator mapping in localStorage (so that we know who created this news)
          const newsId = response.data?.id; // API returns the created/updated news object
          if (newsId && currentUser?.username) {
            const newsCreators = JSON.parse(localStorage.getItem('news_creators') || '{}');
            newsCreators[newsId] = currentUser.username;
            localStorage.setItem('news_creators', JSON.stringify(newsCreators));
            console.log(`Saved creator mapping: ${newsId} -> ${currentUser.username}`);
          }
          
          navigate("/news");
        } else {
          toast.error(`Operation failed!`);
        }
      } catch (error: any) {
        console.error(error);
        if (error.response?.status === 403) {
          toast.error('Permission denied. You need valid API credentials.');
        } else if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          navigate('/login');
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const handleMediaTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const type = event.target.value as "image" | "video";
    setSelectedMediaType(type);
    if (type === "image") {
      formik.setFieldValue("video", null);
      formik.setFieldValue("bannerImage", initData.bannerImage || "");
      setSelectedVideoInputType(null);
    } else if (type === "video") {
      formik.setFieldValue("bannerImage", null);
      formik.setFieldValue("video", {
        internalFile: { video: null, thumbnail: null },
        externalFile: { url: null },
      });
      if (!selectedVideoInputType) {
        setSelectedVideoInputType("internal");
      }
    }
    setTimeout(() => {
      formik.validateForm();
    }, 0);
  };

  const handleVideoTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const type = event.target.value as "internal" | "external";
    setSelectedVideoInputType(type);
    const currentVideo = formik.values.video || {
      internalFile: { video: null, thumbnail: null },
      externalFile: { url: null },
    };

    if (type === "internal") {
      formik.setFieldValue("video", {
        ...currentVideo,
        externalFile: { url: null },
      });
    } else {
      formik.setFieldValue("video", {
        ...currentVideo,
        internalFile: { video: null, thumbnail: null },
      });
    }
  };

  const uploadBannerImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setIsUploadingImage(true);
    try {
      const url = await fileService(file, "MEDIA_IMAGES");
      formik.setFieldValue("bannerImage", url);
      formik.setFieldValue("video", null);
      toast.success("Image uploaded successfully!");
      setTimeout(() => {
        formik.validateForm();
      }, 0);
    } catch {
      toast.error("Image upload failed.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const uploadVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!uploadSizeLimit(file.size)) {
      return;
    }
    setIsUploadingVideo(true);
    try {
      const res = await uploadVideoAndThumbnail({
        file,
        videoPath: "MEDIA_VIDEOS",
        thumbnailPath: "MEDIA_IMAGES",
      });

      const currentVideo = formik.values.video || {
        internalFile: { video: null, thumbnail: null },
        externalFile: { url: null },
      };

      await formik.setFieldValue("video", {
        ...currentVideo,
        internalFile: {
          video: res.video.url,
          thumbnail: res.thumbnail.url,
        },
        externalFile: null,
      });
      console.log("Updated video state:", formik.values.video);
      toast.success("Video uploaded successfully!");

      setTimeout(() => {
        formik.validateForm();
        formik.setFieldTouched("video", true);
      }, 100);
    } catch (error) {
      console.error("Video upload error:", error);
      toast.error("Video upload failed.");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const removeHashtagLinks = (embedCode: string): string => {
    if (!embedCode) return embedCode;
    let cleanedCode = embedCode.replace(
      /<a\s+href=["'][^"']*(?:hashtag|hash)[^"']*["'][^>]*>#\w+<\/a>\s*/gi,
      ''
    );
    cleanedCode = cleanedCode.replace(/\s{2,}/g, ' ');
    return cleanedCode;
  };

  const handleExternalUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawUrl = e.target.value;
    const url = removeHashtagLinks(rawUrl);
    
    const currentVideo = formik.values.video || {
      internalFile: { video: null, thumbnail: null },
      externalFile: { url: null },
    };

    formik.setFieldValue("video", {
      ...currentVideo,
      externalFile: { url: url || null },
      internalFile: null,
    });

    setTimeout(() => {
      formik.validateForm();
    }, 0);
  };

  useEffect(() => {
    const title = formik.values.title;
    const description = formik.values.description;
    if ((title && title.trim() !== "") && (description && description.trim() !== "" && description !== "<p><br></p>")) {
      setIsTitleAndDescNull(false);
    } else {
      setIsTitleAndDescNull(true);
    }
  }, [formik.values.title, formik.values.description]);

  return (
    <div className="card mb-5 mb-xl-10">
      <div className="card-header border-0">
        <h3 className="fw-bolder m-0 my-5">
          {id ? "Edit News Article" : "Create News Article"}
        </h3>
      </div>
      <form onSubmit={formik.handleSubmit} noValidate className="form">
        <div className="card-body border-top p-9">
          {/* Title */}
          <div className="row mb-6">
            <label className="col-lg-4 col-form-label required fw-bold fs-6">Title</label>
            <div className="col-lg-8 fv-row">
              <input
                type="text"
                className="form-control form-control-lg form-control-solid"
                placeholder="Enter the news title..."
                {...formik.getFieldProps("title")}
              />
              <div className="d-flex justify-content-between">
                {formik.touched.title && formik.errors.title && (
                  <div className="fv-help-block text-danger">{formik.errors.title}</div>
                )}
                <div className={`text-end ${(formik.values.title?.length || 0) > 100 ? "text-danger" : "text-muted"}`}>
                  {formik.values.title?.length || 0}/100
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="row mb-6 my-5">
            <label className="col-lg-4 col-form-label required fw-bold fs-6">Description</label>
            <div className="col-lg-8 fv-row my-5">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={formik.values.description || ""}
                onChange={(value) => {
                  formik.setFieldValue("description", value);
                  if (quillRef.current) {
                    const editor = quillRef.current.getEditor();
                    setDescriptionCharCount(editor.getText().trim().length);
                  }
                }}
                onBlur={() => formik.setFieldTouched("description", true)}
                style={{ height: "200px", marginBottom: "70px" }}
                placeholder="Enter the news description..."
              />
              <div className="d-flex justify-content-between">
                {formik.touched.description && formik.errors.description && (
                  <div className="fv-help-block text-danger">{formik.errors.description}</div>
                )}
                <div className={`text-end ${descriptionCharCount > 600 ? "text-danger" : "text-muted"}`}>
                  {descriptionCharCount}/600
                </div>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="row mb-6">
            <label className="col-lg-4 col-form-label fw-bold fs-6">Category</label>
            <div className="col-lg-8 fv-row">
              <FormControl fullWidth>
                <Select
                  id="categoryType"
                  name="categoryType"
                  value={formik.values.categoryType || ""}
                  onChange={formik.handleChange}
                  fullWidth
                  displayEmpty
                >
                  <MenuItem value="" disabled>Select Category</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.label.toUpperCase()}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          {/* District */}
          <div className="row mb-6">
            <label className="col-lg-4 col-form-label fw-bold fs-6">District</label>
            <div className="col-lg-8 fv-row">
              <FormControl fullWidth>
                <Select
                  id="Select District"
                  name="district"
                  value={formik.values.district || ""}
                  onChange={formik.handleChange}
                  fullWidth
                  displayEmpty
                >
                  <MenuItem value="" disabled>Select District</MenuItem>
                  {districts.map((district) => (
                    <MenuItem key={district.id} value={district.name}>
                      {district.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Tags */}
          <div className="row mb-6">
            <label className="col-lg-4 col-form-label fw-bold fs-6">Tags</label>
            <div className="col-lg-8 fv-row">
              <input
                type="text"
                className="form-control form-control-lg form-control-solid my-2 border-grey-500"
                placeholder="Enter tags and press enter to add..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const newTag = (e.target as HTMLInputElement).value.trim();
                    if (newTag) {
                      const current = formik.values.tags || [];
                      formik.setFieldValue("tags", [...current, newTag]);
                      setTagInput("");
                    }
                  }
                }}
              />
              <div className="mt-2">
                {formik.values.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="badge border border-dark px-2 py-1 me-2 mb-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      const updated = formik.values.tags?.filter((_, idx) => idx !== i) || [];
                      formik.setFieldValue("tags", updated);
                    }}
                  >
                    {tag} ×
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Media Type Selector */}
          <div className="row mb-6 my-5">
            <label className="col-lg-4 col-form-label fw-bold fs-6">Select Media Type</label>
            <div className="col-lg-8">
              <RadioGroup row aria-label="mediaType" name="mediaType" value={selectedMediaType} onChange={handleMediaTypeChange}>
                <FormControlLabel value="image" control={<Radio />} label="Image" />
                <FormControlLabel value="video" control={<Radio />} label="Video" />
              </RadioGroup>
            </div>
          </div>

          {/* Image Upload */}
          {selectedMediaType === "image" && (
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label required fw-bold fs-6">Upload Banner Image</label>
              <div className="col-lg-8 fv-row">
                <label htmlFor="image-upload" className="btn btn-light-primary me-5">
                  <KTIcon iconName="file-up" className="fs-2" />
                  {isUploadingImage ? "Uploading..." : formik.values.bannerImage ? "Change Image" : "Select Image"}
                </label>
                <input id="image-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={uploadBannerImage} disabled={isUploadingImage} />
                {formik.values.bannerImage && (
                  <div className="mt-3 symbol symbol-200px">
                    <img src={formik.values.bannerImage} alt="Banner Preview" />
                  </div>
                )}
                {formik.touched.bannerImage && formik.errors.bannerImage && (
                  <div className="fv-help-block text-danger mt-2">{formik.errors.bannerImage}</div>
                )}
              </div>
            </div>
          )}

          {/* Video Upload */}
          {selectedMediaType === "video" && (
            <>
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">Video Source</label>
                <div className="col-lg-8">
                  <RadioGroup row aria-label="videoSource" name="videoSource" value={selectedVideoInputType} onChange={handleVideoTypeChange}>
                    <FormControlLabel value="internal" control={<Radio />} label="Upload Video" />
                    <FormControlLabel value="external" control={<Radio />} label="External URL" />
                  </RadioGroup>
                </div>
              </div>

              {selectedVideoInputType === "internal" && (
                <div className="row mb-6">
                  <label className="col-lg-4 col-form-label required fw-bold fs-6 mr-10">Upload Video File</label>
                  <div className="col-lg-8 fv-row">
                    <label htmlFor="video-upload" className="btn btn-light-primary me-5">
                      <KTIcon iconName="file-up" className="fs-2" />
                      {isUploadingVideo ? "Uploading..." : formik.values.video?.internalFile?.video ? "Change Video" : "Select Video"}
                    </label>
                    <input id="video-upload" type="file" accept="video/*" onChange={uploadVideo} disabled={isUploadingVideo} style={{ display: "none" }} />
                    {formik.values.video?.internalFile?.thumbnail && (
                      <div className="mt-3 symbol symbol-200px">
                        <img src={formik.values.video.internalFile.thumbnail} alt="Video thumbnail" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedVideoInputType === "external" && (
                <div className="row mb-6">
                  <label className="col-lg-4 col-form-label required fw-bold fs-6">Video URL</label>
                  <div className="col-lg-8 fv-row">
                    <input
                      type="url"
                      className="form-control form-control-lg form-control-solid"
                      placeholder="https://"
                      value={formik.values.video?.externalFile?.url || ""}
                      onChange={handleExternalUrlChange}
                      onBlur={() => formik.setFieldTouched("video", true)}
                    />
                  </div>
                </div>
              )}
              {formik.touched.video && typeof formik.errors.video === "string" && (
                <div className="fv-help-block text-danger">{formik.errors.video}</div>
              )}
            </>
          )}

          {/* Send Notification */}
          <div className="mt-6 mb-6">
            <FormControlLabel
              control={
                <Checkbox
                  checked={sendNotification}
                  onChange={(e) => setSendNotification(e.target.checked)}
                  name="sendNotification"
                  color="primary"
                  disabled={isTitleAndDescNull || loading}
                />
              }
              label={<Typography variant="body1" sx={{ fontWeight: 600, fontSize: "1.075rem" }}>Send Notification</Typography>}
            />
            <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 4 }}>
              Check this to send push notifications to users when the story is {id ? "updated" : "published"}.
            </Typography>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-end py-6 px-9" style={{ position: "sticky", bottom: 0, color: "white", background: "white", zIndex: 100 }}>
          <button className="btn me-4" disabled={loading} onClick={() => navigate("/dashboard")}>
            Cancel
            {loading && <span className="spinner-border spinner-border-sm align-middle ms-2"></span>}
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading || !formik.isValid}>
            {!loading ? "Save" : "Please wait..."}
            {loading && <span className="spinner-border spinner-border-sm align-middle ms-2"></span>}
          </button>
        </div>
      </form>
    </div>
  );
};

export { NewsFormDetails };
