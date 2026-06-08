import React, { useEffect, useState } from "react";
import {
  createBlogFormDetailsSchema,
  createBlogFormInitValues,
  ICreateBlogFormDetails,
} from "./CreateBlogFormModel.js";
import { useFormik } from "formik";
import client from "../../modules/service/network.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import fileService from "../../modules/service/fileservice.js";
import { KTIcon, toAbsoluteUrl } from "../../../_metronic/helpers";
import ReactQuill from "react-quill";
const CreateBlogFormDetails: React.FC = () => {
  const { id } = useParams();
  const [initData, setInitData] = useState<ICreateBlogFormDetails>(
    createBlogFormInitValues
  );
  const maxCharsTitle = 30;
  const maxCharsDesc = 160;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUri, setImageUri] = useState<string>("");
  useEffect(() => {
    if (id === undefined) {
      setLoading(false);
      setInitData(createBlogFormInitValues);
    } else {
      client
        .get(`blogs/${id}`)
        .then((response) => {
          setLoading(false);
          setInitData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [id]);

  const formik = useFormik<ICreateBlogFormDetails>({
    initialValues: initData,
    validationSchema: createBlogFormDetailsSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        let response;
        if (id) {
          response = await client.patch(`/blogs/${id}`, values, {
            headers: {
              "Content-Type": "application/json",
            },
          });
        } else {
          response = await client.post("/blog", values, {
            headers: {
              "Content-Type": "application/json",
            },
          });
        }

        if (response.status >= 200 && response.status < 300) {
          toast.success("Blog updated successfully!");
          navigate("/blogs");
        } else if (response.status === 401 || response.status === 403) {
          toast.error("Please login");
          window.location.reload();
        } else {
          toast.error("Blog update failed!");
        }
      } catch (error) {
        console.log(error);
        toast.error("Blog update failed!");
      } finally {
        setLoading(false);
      }
    },
  });
  const uploadBannerImage = (e: any) => {
    const file = e.target.files[0];
    setImageUpload(file);
    setImageUri(URL.createObjectURL(file));

    setLoading(true);
    const upload = async () => {
      try {
        const fileUrl = await fileService(file, "MEDIA_IMAGES");
        console.log(fileUrl);

        if (fileUrl) {
          formik.setValues({
            ...formik.values,
            bannerImage: fileUrl,
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
    upload();
  };

  console.log("formik", formik)

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
          <h3 className="fw-bolder m-0">Create Blog</h3>
        </div>
      </div>

      <div id="kt_account_profile_details" className="collapse show">
        <form onSubmit={formik.handleSubmit} noValidate className="form">
          <div className="card-body border-top p-9">
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label required fw-bold fs-6">
                Title ({formik.values.title.length}/{maxCharsTitle})
              </label>

              <div className="col-lg-8 fv-row">
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid"
                  placeholder="Title"
                  maxLength={30}
                  {...formik.getFieldProps("title")}
                />

                {formik.touched.title && formik.errors.title && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik.errors.title}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="row mb-6">
              <label className="col-lg-4 col-form-label required fw-bold fs-6">
                Description ({formik.values.description.length}/{maxCharsDesc})
              </label>

              <div className="col-lg-8 fv-row">
                <textarea
                  rows={3}
                  placeholder="Description"
                  maxLength={160}
                  className="form-control form-control-lg form-control-solid"
                  {...formik.getFieldProps("description")}
                />

                {formik.touched.description && formik.errors.description && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formik.errors.description}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="row mb-6">
              <label className="col-lg-4 col-form-label required fw-bold fs-6">
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
                  Content
                </label>

                <div className="col-lg-8 fv-row">
                    <ReactQuill
                    theme="snow"
                    value={formik.values.content}
                    onChange={(value) => 
                      formik.setFieldValue("content", value)
                    }
                    placeholder="Content"
                    className="form-control form-control-lg form-control-solid"
                    />
                  

                  {formik.touched?.content && formik.errors?.content && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formik.errors?.content}
                        </div>
                      </div>
                  )}
                </div>
              </div>

            <div className="row mb-6">
              <label className="col-lg-4 col-form-label required fw-bold fs-6">
                Upload banner image
              </label>

              <div className="col-lg-8 fv-row">
                <label
                  htmlFor="file-upload"
                  className="btn btn-sm btn-light-primary w-50 fs-6 p-5"
                >
                  <KTIcon iconName="file-up" className="fs-2" />
                  Upload image
                </label>

                <input
                  id="file-upload"
                  type="file"
                  onChange={uploadBannerImage}
                  accept="image/*"
                  style={{ display: "none" }}
                />

                {formik.touched.bannerImage && formik.errors.bannerImage && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formik.errors.bannerImage}
                    </div>
                  </div>
                )}

                {imageUri && (
                  <div>
                    <br />
                    <div className="symbol symbol-200px me-5 col-lg-8 fv-row">
                      <img src={imageUri} alt="preview of banner image" />
                    </div>
                  </div>
                )}

                {id && !imageUri && (
                  <div>
                    <br />
                    <div className="symbol symbol-200px me-5 col-lg-8 fv-row">
                      <img
                        src={formik.values.bannerImage}
                        alt="preview of banner image"
                      />
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

export { CreateBlogFormDetails };
