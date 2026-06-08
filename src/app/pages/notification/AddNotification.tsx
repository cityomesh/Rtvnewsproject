import { PageTitle } from "../../../_metronic/layout/core";
import { KTIcon } from "../../../_metronic/helpers";
import React, { useRef, useState } from "react";
import { ErrorMessage, useFormik } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import ReactQuill from "react-quill";
import { uploadFile } from "../../modules/service/fileservice";
import useSWR from "swr";
import { fetcher } from "../../modules/service/network";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker,  } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {makeStyles} from "@mui/styles";
import dayjs, { Dayjs } from 'dayjs';
import { ITeam } from "../matches/match.tsx";

// import { useTeam } from "./player-controller.ts";


import {

INotifications,
initNotificationsVal,
createNotificationsSchema,
createOrUpdateNotification
} from "./notification.tsx";



const AddNotification = () => {
  const { id } = useParams();
  const [initData, setInitData] = useState<INotifications>(
    initNotificationsVal
  );
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<ITeam[] | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>();
  const [isUploadingShareImage, setIsUploadingShareImage] = useState<boolean>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();


  const formik = useFormik<INotifications>({
    initialValues: initData,
    validationSchema: createNotificationsSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setFieldValue }) => {
      

      setLoading(true);
    
      await createOrUpdateNotification({
        values,
        id,
        onSuccess: () => {
          toast.success("Notification Detail saved!");
          navigate("/notification");
          resetForm();
          
          
        },
        onError: (e) => toast.error(e),
        onEnd: () => setLoading(false),
      });
    },
  });
  
  const uploadShareImage = async (e: any) => {
    const file = e.target.files[0];
    setIsUploadingShareImage(true);
    await uploadFile({
      file, type: "MEDIA_IMAGES",
      onSuccess: (e: any) => {
        formik.setFieldValue("imageUrl", e.url);
        console.log(e);
        toast.success("Share Image uploaded successfully!");
        console.log("image url inside sharing image", e.url)
      },
      onError: (code, message) => {
        if (!message) message = "Something went wrong!"
        toast.error(message);
      }
    });
    setIsUploadingShareImage(false);
  };

  const uploadImage = async (e: any) => {
    const file = e.target.files[0];
    setIsUploadingImage(true);
    await uploadFile({
      file, type: "MEDIA_IMAGES",
      onSuccess: (e: any) => {
        formik.setFieldValue("bannerImage", e.url);
        toast.success("Image uploaded successfully!");
      },
      onError: (code, message) => {
        if (!message) message = "Something went wrong!"
        toast.error(message);
      }
    });
    setIsUploadingImage(false);
  };

  console.log("formik", formik)
  return (
    <>
      <PageTitle description="" breadcrumbs={[]}>
        Add Notification
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
            <h3 className="fw-bolder m-0">Add Notification Detail</h3>
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
                      placeholder="Enter Title"
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
              <label className="col-lg-4 col-form-label fw-bold fs-6">
                    Image
                  </label>

                  <div className="col-lg-8 fv-row">
                    <label
                        htmlFor="file-upload"
                        className="btn btn-sm btn-light-primary w-50 fs-6 p-5"
                    >
                      <KTIcon iconName="file-up" className="fs-2"/>
                      {isUploadingShareImage ? (
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
                        id="file-upload"
                        type="file"
                        onChange={uploadShareImage}
                        accept="image/*"
                        disabled={isUploadingShareImage}
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
                          <img src={formik.values.imageUrl}  alt="image"/>
                          </div>
                        </div>
                    )}
                  </div>
              </div> 


              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">
                  Description
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Enter the Description"
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

               {/* Player Social Media Id */}
               <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">
                  Path
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Enter Path"
                     {...formik.getFieldProps("path")}
                  />
                  {formik.touched.path && formik.errors.path && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.path}
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

export default AddNotification;