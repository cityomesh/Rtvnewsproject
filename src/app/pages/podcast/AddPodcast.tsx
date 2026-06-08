import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../modules/service/network";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { PageTitle } from "../../../_metronic/layout/core";
import { RiRadioButtonFill } from "react-icons/ri";
import { IoIosRadioButtonOff } from "react-icons/io";
import ReactQuill from "react-quill";
import { KTIcon } from "../../../_metronic/helpers";
import { uploadFile, uploadVideoAndThumbnail } from "../../modules/service/fileservice";
import { createPodcastSchema, initPodcastVal, IPodcast } from "./podcast";
import { createOrUpdatePodcast } from "./podcast-controller";



export const AddPodcast = () => {
  const { id } = useParams();
  const [initData, setInitData] = useState<IPodcast>(
    initPodcastVal 
  );
  const [loading, setLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>();
  const [isUploadingAudio, setIsUploadingAudio] = useState<boolean>();

  const navigate = useNavigate();
  
  if(id){
    const { data, error, isLoading } = useSWR(`/podcast/${id}`, fetcher, {
        onSuccess: (data, key, config) => {
        console.log({ data }); //this always prints "undefined"
        setInitData(data);
        },
    });
  }

  const formik = useFormik<IPodcast>({
    initialValues: initData,
    validationSchema: createPodcastSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      // setLoading(false);
      await createOrUpdatePodcast({
        values,
        id,
        onSuccess: () => {
          toast.success("Podcast saved!");
          navigate("/podcast");
        },
        onError: (e) => toast.error(e),
        onEnd: () => setLoading(false),
      });
    },
  });
  
  const uploadAudio = async (e: any) => {
    const file = e.target.files[0];
    setIsUploadingAudio(true);
    await uploadFile({
      file, type: "MEDIA_VIDEOS",
      onSuccess: (e: any) => {
        formik.setFieldValue("audioFileUrl", e.url);
        toast.success("Video uploaded successfully!");
      },
      onError: (code, message) => {
        if (!message) message = "Something went wrong!"
        toast.error(message);
      }
    });
    setIsUploadingAudio(false);
  };

  const uploadImage = async (e: any) => {
    const file = e.target.files[0];
    setIsUploadingImage(true);
    await uploadFile({
      file, type: "MEDIA_IMAGES",
      onSuccess: (e: any) => {
        formik.setFieldValue("imageUrl", e.url);
        toast.success("Video uploaded successfully!");
      },
      onError: (code, message) => {
        if (!message) message = "Something went wrong!"
        toast.error(message);
      }
    });
    setIsUploadingImage(false);
  };

  return (
    <>
      <PageTitle description="" breadcrumbs={[]}>
        Add Podcast
      </PageTitle>
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
            <h3 className="fw-bolder m-0">Create Podcast</h3>
          </div>
        </div>
        {/* Venue State */}
        <div id="kt_account_profile_details" className="collapse show">
          <form onSubmit={formik.handleSubmit} noValidate className="form">
            <div className="card-body border-top p-9">
                <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Title
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="title"
                     {...formik.getFieldProps("title")}
                  />
                  

                  {formik.touched.title && formik.errors.title && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formik.errors.title}
                        </div>
                      </div>
                  )}
                </div>
              </div>
              <div className="row mb-6">
              <label className="col-lg-4 col-form-label required fw-bold fs-6">
                    Upload Audio
                  </label>

                  <div className="col-lg-8 fv-row">
                    <label
                        htmlFor="file-upload"
                        className="btn btn-sm btn-light-primary w-50 fs-6 p-5"
                    >
                      <KTIcon iconName="file-up" className="fs-2"/>
                      {isUploadingAudio ? (
                          <span
                              className="indicator-progress"
                              style={{display: "block"}}
                          >
                      Uploading Audio{" "}
                            <span
                                className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                      ) : "Select Audio"}
                    </label>

                    <input
                        id="file-upload"
                        type="file"
                        onChange={uploadAudio}
                        accept="audio/*"
                        disabled={isUploadingAudio}
                        style={{display: "none"}}
                    />

                    {formik.touched.audioFileUrl && formik.errors.audioFileUrl && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.audioFileUrl}
                          </div>
                        </div>
                    )}

                    {formik.values.audioFileUrl!=="" && (
                        <div>
                          <br/>
                          <div className="symbol symbol-200px me-5 col-lg-8 fv-row">
                          <audio controls src={formik.values.audioFileUrl}></audio>
                          </div>
                        </div>
                    )}
                  </div>
              </div>
              <div className="row mb-6">
              <label className="col-lg-4 col-form-label required fw-bold fs-6">
                    Upload Image
                  </label>

                  <div className="col-lg-8 fv-row">
                    <label
                        htmlFor="image-upload"
                        className="btn btn-sm btn-light-primary w-50 fs-6 p-5"
                    >
                      <KTIcon iconName="file-up" className="fs-2"/>
                      {isUploadingImage ? (
                          <span
                              className="indicator-progress"
                              style={{display: "block"}}
                          >
                      Uploading Image{" "}
                            <span
                                className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                      ) : "Select Image"}
                    </label>

                    <input
                        id="image-upload"
                        type="file"
                        onChange={uploadImage}
                        accept="image/*"
                        disabled={isUploadingImage}
                        style={{display: "none"}}
                    />

                    {formik.touched.imageUrl && formik.errors.imageUrl && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.imageUrl}
                          </div>
                        </div>
                    )}

                    {formik.values.imageUrl!=="" && (
                        <div>
                          <br/>
                          <div className="symbol symbol-200px me-5 col-lg-8 fv-row">
                          <img src={formik.values.imageUrl} />
                          </div>
                        </div>
                    )}
                  </div>
              </div>
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Description
                </label>

                <div className="col-lg-8 fv-row">
                    <ReactQuill
                    theme="snow"
                    value={formik.values.description}
                    onChange={(value) => formik.setFieldValue("description", value)}
                    placeholder="Content"
                    className="form-control form-control-lg form-control-solid"
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
             
              {/* Submit */}
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
    </>
  );
};
