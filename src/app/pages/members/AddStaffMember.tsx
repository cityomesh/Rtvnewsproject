import { PageTitle } from "../../../_metronic/layout/core";
import { KTIcon } from "../../../_metronic/helpers";
import React, { useEffect, useState } from "react";
import { ErrorMessage, useFormik } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";

import { uploadFile } from "../../modules/service/fileservice";
import useSWR from "swr";
import { fetcher } from "../../modules/service/network";
import { ITeam } from "../matches/match.tsx";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker,  } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {makeStyles} from "@mui/styles";
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

import { useTeam } from "./player-controller.ts";

import {

ISupportStaff,
initSupportStaffVal,
createSupportStaffSchema,
createOrUpdateSupportStaff
} from "./staff.tsx";
import { usePlayer } from "./members-controller.ts";




const AddStaffMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
 
  const [initData, setInitData] = useState<ISupportStaff>(
    initSupportStaffVal 
  );
  
  const [loading, setLoading] = useState(false);
  const [isUploadingShareImage, setIsUploadingShareImage] = useState<boolean>();


  const { team: teams, isLoading: teamsLoading } = useTeam((teamData) => teamData);
  const { player: playerData, isLoading: playerLoading } = usePlayer(id || "", (playerData) => playerData);

  useEffect(() => {
    if (!teamsLoading && !playerLoading && id && teams && Array.isArray(teams)) {
      const matchedTeam = teams.find((t) => t.teamId === playerData?.teamId);
      const updatedData = {
        ...playerData,
        teamId: JSON.stringify(matchedTeam || {}),
      };
  
      // Only update state if data actually changes
      if (JSON.stringify(initData) !== JSON.stringify(updatedData)) {
        setInitData(updatedData);
      }
    } else {
      setInitData(initSupportStaffVal); // Reset to initial values when creating
    }
  }, [id, teams, playerData, teamsLoading, playerLoading]);


 

console.log("teams", teams)
  

  const formik = useFormik<ISupportStaff>({
    initialValues: initData,
    validationSchema: createSupportStaffSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log("values", values)
      const dataToSend = {
        ...values,
        teamId: JSON.parse(values.teamId).teamId,
      };

      setLoading(true);
      // setLoading(false)
      
      await createOrUpdateSupportStaff({
        values: dataToSend,
        id,
        onSuccess: () => {
          console.log("Values on submit", values)
          toast.success("Staff Detail saved!");
          navigate("/staffs");
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
        formik.setFieldValue("photo", e.url);
        toast.success("Share Image uploaded successfully!");
      },
      onError: (code, message) => {
        if (!message) message = "Something went wrong!"
        toast.error(message);
      }
    });
    setIsUploadingShareImage(false);
  };

  
  console.log("formik", formik)

  return (
    <>
      <PageTitle description="" breadcrumbs={[]}>
        {id ? "Edit Staff Details" : "Create Staff Member"}
      </PageTitle>
      <div className="card mb-5 mb-xl-10">
        
        <div id="kt_account_profile_details" className="collapse show">
          <form onSubmit={formik.handleSubmit} noValidate className="form">
            <div className="card-body border-top p-9">
            <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Name
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                      type="text"
                      className="form-control form-control-lg form-control-solid"
                      placeholder="Enter Member Name"
                      {...formik.getFieldProps("name")}
                    />
                  

                  {formik.touched.name && formik.errors.name && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formik.errors.name}
                        </div>
                      </div>
                  )}
                </div>
              </div>

              <div className="row mb-6">
              <label className="col-lg-4 col-form-label required fw-bold fs-6">
                    Photo
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
                      Uploading Share Image{" "}
                            <span
                                className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                      ) : "Select Photo Image"}
                    </label>

                    <input
                        id="file-upload"
                        type="file"
                        onChange={uploadShareImage}
                        accept="image/*"
                        disabled={isUploadingShareImage}
                        style={{display: "none"}}
                    />

                    {formik.touched.photo && formik.errors.photo && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.photo}
                          </div>
                        </div>
                    )}

                    {formik.values.photo!=="" && (
                        <div>
                          <br/>
                          <div className="symbol symbol-200px me-5 col-lg-8 fv-row">
                          <img src={formik.values.photo}  alt="Player image"/>
                          </div>
                        </div>
                    )}
                  </div>
              </div> 

              {/* Member Position */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Position
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Position of a Member"
                     {...formik.getFieldProps("position")}
                  />
                  
                    {formik.touched.position && formik.errors.position && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.position}
                          </div>
                        </div>
                    )}
                  
                </div>
              </div>

              {/* members Type */}
              {/* <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Member Type
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Member Type"
                     readOnly
                     {...formik.getFieldProps("memberType")}
                  />
                  
                    {formik.touched.memberType && formik.errors.memberType && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.memberType}
                          </div>
                        </div>
                    )}
                  
                </div>
              </div> */}

              {/* Memeber Staff Type */}
              {/* <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Staff Type
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Staff Type"
                     {...formik.getFieldProps("staffType")}
                  />
                  
                    {formik.touched.staffType && formik.errors.staffType && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.staffType}
                          </div>
                        </div>
                    )}
                  
                </div>
              </div> */}

              {/* Date of Birth */}

              {/* <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Date Of Birth
                </label>
                <div className="col-lg-8 fv-row">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                              sx={{ p: '10px', border: 'none', outline: 'none' }}
                              onChange={(date) => {
                                formik.setFieldValue('dob', date?.toISOString()); // Set only the date
                              }}
                              value={dayjs(formik.values.dob)}
                              format="MM/DD/YYYY"
                              className={`form-control form-control-solid`}
                            />
                    </DemoContainer>
                  </LocalizationProvider>

                  {formik.touched.dob && formik.errors.dob && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                         {formik.errors.dob}
                         
                      </div>
                    </div>
                  )}
                </div>
              </div> */}

               {/* Player Social Media Id */}
               <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Social Media Id
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Enter Member Social Media Id"
                     {...formik.getFieldProps("socialMediaId")}
                  />
                  {formik.touched.socialMediaId && formik.errors.socialMediaId && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.socialMediaId}
                          </div>
                        </div>
                    )}

                  
                </div>
              </div>

              {/* Player Height */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Height
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Enter height (e.g., 5'3'')"
                     {...formik.getFieldProps("height")}
                  />
                  
                    {formik.touched.height && formik.errors.height && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.height}
                          </div>
                        </div>
                    )}
                  
                </div>
              </div>

{/* Team 1 Drop Down */}
<div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Team
                </label>

                <div className="col-lg-8 fv-row">
                  <select
                      className="form-select form-select-solid form-select-lg fw-bold"
                      value={
                        formik.values.teamId
                          ? formik.values.teamId
                          : ""
                      }
                      // {...formik.getFieldProps("formik.values.team1?.teamName")}
                      // onChange={(e) => {
                      //   console.log("team value in player", JSON.parse(e.target.value).teamId)
                      //   formik.setFieldValue(`teamId`, e.target.value);
                        
                      // }}
                      name="teamId"
                      onChange={formik.handleChange}
                  >
                    <option value="">Select Team </option>
                    {teams?.map((t) => (
                      
                      <option key={t.teamId} value={JSON.stringify(t)}>
                        {t.teamName}
                      </option>
                    ))}
                  </select>

                  {formik.touched.teamId && formik.errors.teamId && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">{formik.errors.teamId}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Player Age */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Age
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="number"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Enter Member Age"
                     {...formik.getFieldProps("age")}
                  />
                  
                    {formik.touched.age && formik.errors.age && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.age}
                          </div>
                        </div>
                    )}
                  
                </div>
              </div>

              
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  City
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Enter Member City Name"
                     {...formik.getFieldProps("city")}
                  />
                  

                  {formik.touched.city && formik.errors.city && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.city}
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

export default AddStaffMember;