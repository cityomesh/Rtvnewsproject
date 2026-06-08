import React, { useEffect, useState } from "react";
import {
  createTutorialsFormDetailsSchema,
  createTutorialsFormInitValues,
  ICreateTutorialsFormDetails,
  extractText,
} from "./CreateTutorialsFormModel.js";
import { useFormik } from "formik";
import client from "../../modules/service/network.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import fileService from "../../modules/service/fileservice.js";
import { KTIcon, toAbsoluteUrl } from "../../../_metronic/helpers/index.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../../_metronic/assets/sass/layout/quillEditor.css";
import parse from "html-react-parser";
import { NULL } from "node-sass";
const CreateTutorialsFormDetails: React.FC = () => {
  const { id } = useParams();
  const [initData, setInitData] = useState<ICreateTutorialsFormDetails>(
    createTutorialsFormInitValues
  );
  const maxCharsTopic = 50;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUri, setImageUri] = useState<string>("");
  const [videoUpload, setVideoUpload] = useState(null);
  const [videoUri, setVideoUri] = useState<string>("");
  useEffect(() => {
    if (id === undefined) {
      setLoading(false);
      setInitData(createTutorialsFormInitValues);
    } else {
      client
        .get(`tutorials/${id}`)
        .then((response) => {
          setLoading(false);
          setInitData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [id]);

  const formik = useFormik<ICreateTutorialsFormDetails>({
    initialValues: initData,
    validationSchema: createTutorialsFormDetailsSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (values.sourceUrl === "") values.sourceUrl = null;
      if (values.imageUrl === "") values.imageUrl = null;
      if (values.videoUrl === "") values.videoUrl = null;
      try {
        setLoading(true);
        let response;
        if (id) {
          response = await client.patch(`/tutorials/${id}`, values, {
            headers: {
              "Content-Type": "application/json",
            },
          });
        } else {
          response = await client.post("/tutorials", values, {
            headers: {
              "Content-Type": "application/json",
            },
          });
        }

        if (response.status >= 200 && response.status < 300) {
          toast.success("Tutorial updated successfully!");
          navigate("/tutorials");
        } else if (response.status === 401 || response.status === 403) {
          toast.error("Please login");
          window.location.reload();
        } else {
          toast.error("Tutorial update failed!");
        }
      } catch (error) {
        console.log(error);
        toast.error("Tutorial update failed!");
      } finally {
        setLoading(false);
      }
    },
  });
  const uploadImage = (e: any) => {
    const imgFile = e.target.files[0];
    setImageUpload(imgFile);
    setImageUri(URL.createObjectURL(imgFile));

    setLoading(true);
    const uploadImg = async () => {
      try {
        const imgFileUrl = await fileService(imgFile, "MEDIA_IMAGES");

        if (imgFileUrl) {
          formik.setValues({
            ...formik.values,
            imageUrl: imgFileUrl,
          });
          toast.success("Image uploaded successfully!");
        }
      } catch (e) {
        toast.error("Error uploading image");
        console.error("Error occurred while uploading image:", e);
      } finally {
        setLoading(false);
        setImageUpload(null);
      }
    };
    uploadImg();
  };

  const uploadVideo = (e: any) => {
    const vidFile = e.target.files[0];
    setVideoUpload(vidFile);
    setVideoUri(URL.createObjectURL(vidFile));

    setLoading(true);
    const uploadVid = async () => {
      try {
        const vidFileUrl = await fileService(vidFile, "MEDIA_VIDEOS");

        if (vidFileUrl) {
          formik.setValues({
            ...formik.values,
            videoUrl: vidFileUrl,
          });
          toast.success("Video uploaded successfully!");
        }
      } catch (e) {
        toast.error("Error uploading video");
        console.error("Error occurred while uploading video:", e);
      } finally {
        setLoading(false);
        setVideoUpload(null);
      }
    };
    uploadVid();
  };

  return (
    <div className="card mb-5 mb-xl-10">
      <div
        className="card-header border-0 cursor-pointer"
        role="button"
        data-bs-toggle="collapse"
        data-bs-target="#kt_account_profile_details"
        aria-expanded="true"
        aria-controls="kt_account_profile_details"
      >
        <div className="card-title m-0">
          <h3 className="fw-bolder m-0">Create Tutorial</h3>
        </div>
      </div>

      <div id="kt_account_profile_details" className="collapse show">
        <form onSubmit={formik.handleSubmit} noValidate className="form">
          <div className="card-body border-top p-9">
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label required fw-bold fs-6">
                Topic ({formik.values.topic.length}/{maxCharsTopic})
              </label>

              <div className="col-lg-8 fv-row">
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid"
                  placeholder="Topic"
                  maxLength={50}
                  {...formik.getFieldProps("topic")}
                />

                {formik.touched.topic && formik.errors.topic && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik.errors.topic}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="row mb-6 quill-editor-container">
              <label className="col-lg-4 col-form-label required fw-bold fs-6">
                Content 
              </label>

              <div className="col-lg-8 fv-row">
                <ReactQuill
                  theme="snow"
                  value={formik.values.content}
                  onChange={(value) => formik.setFieldValue("content", value)}
                  placeholder="Content"
                  className="form-control form-control-lg form-control-solid"
                />

                {formik.touched.content && formik.errors.content && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik.errors.content}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="row mb-6">
              <label className="col-lg-4 col-form-label fw-bold fs-6">
                Source URL
              </label>

              <div className="col-lg-8 fv-row">
                <input
                  type="url"
                  placeholder="Source URL"
                  className="form-control form-control-lg form-control-solid"
                  {...formik.getFieldProps("sourceUrl")}
                />

                {formik.touched.sourceUrl && formik.errors.sourceUrl && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formik.errors.sourceUrl}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="row mb-6">
              <label className="col-lg-4 col-form-label required fw-bold fs-6">
                Category
              </label>
              <div className="col-lg-8 fv-row">
                <select
                  className="form-select form-select-lg form-select-solid"
                  {...formik.getFieldProps("category")}
                >
                  <option value="">Select a category</option>
                  <option value="BASICS">Basics</option>
                  <option value="PITCH_RULES">Pitch Rules</option>
                  <option value="TEAM_RULES">Team Rules</option>
                  <option value="I_LEAGUE">I League</option>
                </select>
                {formik.touched.category && formik.errors.category && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formik.errors.category}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="row mb-6">
              <label className="col-lg-4 col-form-label  fw-bold fs-6">
                Upload Tutorial Image
              </label>

              <div className="col-lg-8 fv-row">
                <label
                  htmlFor="image-upload"
                  className="btn btn-sm btn-light-primary w-50 fs-6 p-5"
                >
                  <KTIcon iconName="file-up" className="fs-2" />
                  Upload image
                </label>

                <input
                  id="image-upload"
                  type="file"
                  onChange={uploadImage}
                  accept="image/*"
                  style={{ display: "none" }}
                />

                {formik.touched.imageUrl && formik.errors.imageUrl && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formik.errors.imageUrl}
                    </div>
                  </div>
                )}

                {imageUri && (
                  <div>
                    <br />
                    <div className="symbol symbol-200px me-5 col-lg-8 fv-row">
                      <img src={imageUri} alt="preview of tutorial image" />
                    </div>
                  </div>
                )}

                {formik.values.imageUrl && id && !imageUri && (
                  <div>
                    <br />
                    <div className="symbol symbol-200px me-5 col-lg-8 fv-row">
                      <img
                        src={formik.values.imageUrl}
                        alt="preview of banner image"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="row mb-6">
              <label className="col-lg-4 col-form-label fw-bold fs-6">
                Upload Tutorial Video
              </label>

              <div className="col-lg-8 fv-row">
                <label
                  htmlFor="video-upload"
                  className="btn btn-sm btn-light-primary w-50 fs-6 p-5"
                >
                  <KTIcon iconName="file-up" className="fs-2" />
                  Upload Video
                </label>

                <input
                  id="video-upload"
                  type="file"
                  onChange={uploadVideo}
                  accept="video/*"
                  style={{ display: "none" }}
                />

                {formik.touched.videoUrl && formik.errors.videoUrl && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formik.errors.videoUrl}
                    </div>
                  </div>
                )}

                {videoUri && (
                  <div className="mb-5">
                    <br />
                    <video
                      controls
                      title="Preview of Uploaded Video"
                      className="rounded h-300px w-100"
                      src={videoUri}
                    ></video>
                  </div>
                )}

                {formik.values.videoUrl && id && !videoUri && (
                  <div>
                    <br />
                    <div className="symbol symbol-200px me-5 col-lg-8 fv-row">
                      <video
                        controls
                        title="Preview of Uploaded Video"
                        className="rounded h-300px w-100"
                        src={formik.values.videoUrl}
                      ></video>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card-footer d-flex justify-content-end py-6 px-1">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {!loading && "Save"}
                {loading && (
                  <span
                    className="indicator-progress"
                    style={{ display: "block" }}
                  >
                    Please wait...{" "}
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export { CreateTutorialsFormDetails };
