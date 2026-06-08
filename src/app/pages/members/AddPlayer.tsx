/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
import { PageTitle } from "../../../_metronic/layout/core";
import { KTIcon } from "../../../_metronic/helpers";
import React, { useEffect, useState } from "react";
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
import { useThemeMode } from "../../../_metronic/partials/layout/theme-mode/ThemeModeProvider";
import { createTheme, ThemeProvider } from "@mui/material";
import { grey_02 } from "../../common/colors";
import {makeStyles} from "@mui/styles";
import dayjs, { Dayjs } from 'dayjs';
import { ITeam } from "../matches/match.tsx";

import { useTeam } from "./player-controller.ts";


import {
//   IReview,
//   initReviewVal,
//   createReviewSchema,
IPlayer,
initplayerVal,
createPlayerSchema,
createOrUpdatePlayer
} from "./players.tsx";
import { usePlayer } from "./members-controller.ts";


export const useStyles = makeStyles({
  root: {
    "& .MuiInputBase-root": {
      padding: 0,
      "& .MuiButtonBase-root": {
        padding: 0,
        paddingLeft: 10,
        paddingRight: 10,
      },
      "& .MuiInputBase-input": {
        padding: 0,
      },
      "& .MuiOutlinedInput-notchedOutline": {
        border: 'none'
      }
    }
  },
  dark: {
    "& .MuiInputBase-root": {
      padding: 0,
      color: 'white',
      "& .MuiInputBase-input": {
        padding: 0,
      },
      "& .MuiOutlinedInput-notchedOutline": {
        border: 'none'
      }
    },
    "& .MuiSvgIcon-root": {
      fill: '#fff', 
    },
  },
});




const AddPlayer = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const [initData, setInitData] = useState<IPlayer>(
    initplayerVal 
  );
  const [loading, setLoading] = useState(false);
  // const [teams, setTeams] = useState<ITeam[] | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>();
  const [isUploadingShareImage, setIsUploadingShareImage] = useState<boolean>();
  const themeMode = useThemeMode();
  const classes = useStyles();


  // useTeam((e) => {
  //   setTeams(e);
  // });
  const [systemMode, setSystemMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
);
  

  // usePlayer(id ?? "", (e) => {
  //   if (id) {
  //     setInitData(e); // Set team data for editing
  //   } else {
  //     setInitData(initplayerVal); // Reset to initial values when creating
  //   }
  // });

  const { team: teams, isLoading: teamsLoading } = useTeam((teamData) => teamData);
  const { player: playerData, isLoading: playerLoading } = usePlayer(id || "", (playerData) => playerData);

  const calculateAge = (dob: string) => {
    const birthDate = dayjs(dob);
    const currentDate = dayjs();
    return currentDate.diff(birthDate, 'year');
  };

 
  
  

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
      setInitData(initplayerVal); // Reset to initial values when creating
    }
  }, [id, teams, playerData, teamsLoading, playerLoading]);


  console.log("onSubmit called2")
  const formik = useFormik<IPlayer>({

    initialValues: initData,
    validationSchema: createPlayerSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {

      const dataToSend = {
        ...values,
        teamId: JSON.parse(values.teamId).teamId,
      };
      setLoading(true);
      // setLoading(false);
      console.log("onSubmit called4");
      await createOrUpdatePlayer({
        values: dataToSend,
        id,
        onSuccess: () => {
          toast.success("Player Detail saved!");
          navigate("/players");
        },
        onError: (e) => toast.error(e),
        onEnd: () => setLoading(false),
      });
    },
  });

  console.log("onSubmit called3")

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

  // useEffect(()=> {
  //   return () => {
  //     setInitData(initplayerVal)
  //   }

  //   // if (!id) {
  //   //   setInitData(initTeamVal); // Reset to default values for creating
  //   //   formik.resetForm({ values: initTeamVal }); // Reset the form
  //   // }

  //  },[id])

  useEffect(() => {
    if (formik.values.dob) {
      const age = calculateAge(formik.values.dob);
      formik.setFieldValue('age', age);
    }
  }, [formik.values.dob]);

  const createCalendarTheme = () => {
    if(themeMode.mode==='dark' || (themeMode.mode==='system' && systemMode)){
        return createTheme({
            components: {
              MuiMenuItem: {
                styleOverrides: {
                    root: {
                    '&:hover': {
                        backgroundColor: '#1565c0',
                    },           
                    },
                },
              },
                //@ts-ignore
              MuiPickersDay: {
                styleOverrides: {
                  root: {
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    },
                  },
                },
              },
              MuiSvgIcon: {
                styleOverrides: {
                  root: {
                    color: 'white',           
                  },
                },
              },
              MuiIconButton: {
                styleOverrides: {
                  root: {
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    },           
                  },
                },
              },
              MuiPaper: {
                styleOverrides: {
                    root: {
                backgroundColor: grey_02,
                color: "white"
                },
                },
              },
              MuiTypography: {
                styleOverrides: {
                    caption: {
                color: "white"
                },
                },
              },
            },
          });
    }
    return createTheme({})
}

  const datePickerTheme = createCalendarTheme()


  return (
    <>
      <PageTitle description="" breadcrumbs={[]}>
        Player Details
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
            <h3 className="fw-bolder m-0">Add Player Detail</h3>
          </div>
        </div>
        {/* Venue State */}
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
                      placeholder="Enter Player Name"
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
                    Player Photo
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

              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Position
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Position of a Player"
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

               {/* Player Social Media Id */}
               <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Social Media Id
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Enter Player Social Media Id"
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

              {/* <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Member Type
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                    //  placeholder="Enter Player Name"
                    // name="memberType",
                    readOnly
                     {...formik.getFieldProps("memberType")}
                  />



                </div>
              </div> */}

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
                      onChange={(e) => {
                        console.log("team value in player", JSON.parse(e.target.value).teamId)
                        formik.setFieldValue(`teamId`, e.target.value);

                      }}
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

              {/* Team Id  */}
              {/* <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Team Id
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Player Team Id"
                     {...formik.getFieldProps("teamId")}
                  />

                    {formik.touched.teamId && formik.errors.teamId && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.teamId}
                          </div>
                        </div>
                    )}

                </div>
              </div> */}


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

              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Designation
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Enter Player Designation"
                     {...formik.getFieldProps("designation")}
                  />
                  {formik.touched.designation && formik.errors.designation && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.designation}
                          </div>
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
                     placeholder="Enter Player Age"
                     {...formik.getFieldProps("age")}
                     readOnly
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

              {/* Player Jersey Number */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Jersey Number
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="number"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Enter player Jersey Number"
                     {...formik.getFieldProps("jerseyNumber")}
                  />
                  {formik.touched.jerseyNumber && formik.errors.jerseyNumber && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.jerseyNumber}
                          </div>
                        </div>
                    )}

                  
                </div>
              </div>

              {/* Total Matches played */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Total Matches
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="number"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Enter Total Matches"
                     {...formik.getFieldProps("totalMatches")}
                  />
                  
                    {formik.touched.totalMatches && formik.errors.totalMatches && (
                        <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                            {formik.errors.totalMatches}
                        </div>
                        </div>
                    )}
                  
                </div>
              </div>

              {/* Date of Birth */}

              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Date Of Birth
                </label>
                <div className="col-lg-8 fv-row">
                <ThemeProvider 
                    theme={datePickerTheme}
                  >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                              sx={{ p: '10px', border: 'none', outline: 'none' }}
                              onChange={(date) => {
                                formik.setFieldValue('dob', date?.toISOString()); // Set only the date
                              }}
                              value={dayjs(formik.values.dob)}
                              format="MM/DD/YYYY"
                              className={`form-control form-control-solid ${themeMode.mode==='dark' || (themeMode.mode==='system' && systemMode)?classes.dark:classes.root}`}
                            />
                    </DemoContainer>
                  </LocalizationProvider>
                  </ThemeProvider>
                

                  {formik.touched.dob && formik.errors.dob && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                         {formik.errors.dob}
                         
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
                     placeholder="Enter Player City Name"
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

              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Country
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Enter Player Country Name"
                     {...formik.getFieldProps("country")}
                  />
                  

                  {formik.touched.country && formik.errors.country && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.country}
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

export default AddPlayer;