/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prefer-const */
import { PageTitle } from "../../../_metronic/layout/core";
import { KTIcon } from "../../../_metronic/helpers";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { MultipleDeleteModal } from "../../../_metronic/partials/widgets/modal/MultipleDeleteModal";
// import { useFormik,  } from "formik";

import AddEvents from "./AddEvents.tsx";
import AddStats from "./AddStats.tsx";
import {
  useFormik,
  ErrorMessage,
  Formik,
  Form,
  Field,
  FieldArray,
  FormikHelpers
} from "formik";
import {
  createMatchSchema,
  initMatchVal,
  IMatch,
  initMatchEventsValues,
  initTeamVal,
  ITeam,
  IMatchEvents,
  teamStat,
  teamEvent,
  teamScore,
  initTeamEvent,
  initTeamStat,
  initTeamScore,
  ITeamScoreBoard,
  initTeamScoreBoard,
} from "./match.tsx";
import { createOrUpdateMatch, useMatch, useTeam, getYearOptions } from "./match-controller.ts";
import { uploadFile } from "../../modules/service/fileservice.tsx";
import { formatISOToDateTimeLocal } from "../../modules/service/commonUtils.ts";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import useSWR from "swr";
import {fetcher} from "../../modules/service/network.ts";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useThemeMode } from "../../../_metronic/partials/layout/theme-mode/ThemeModeProvider";
import { createTheme, ThemeProvider } from "@mui/material";
import {makeStyles} from "@mui/styles";
import { grey_02 } from "../../common/colors";
import dayjs, { Dayjs } from 'dayjs';
import { TextField } from "@mui/material";

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
        // backgroundColor: "transparent",
        backgroundColor: "inherit",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        border: 'none'
      },
      "&:focus-within": {
        outline: "none", // Ensure no default outline
      },
    }
  },
  dark: {
    "& .MuiInputBase-root": {
      padding: 0,
      color: 'white',
      "& .MuiInputBase-input": {
        padding: 0,
        backgroundColor: "#1e1e1e", // Ensure background remains dark
      },
      "& .MuiOutlinedInput-notchedOutline": {
        border: 'none'
      },
      "&:focus-within": {
        backgroundColor: "#333333", // Darker shade for focus state
        outline: "2px solid #444", // Optional, for a visible focus indicator
      },
    },
    "& .MuiSvgIcon-root": {
      fill: '#fff', 
    },
  },
});

export const AddMatch = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [initData, setInitData] = useState<IMatch>(
    initMatchVal //this sets initial values of team1 and team2 to null, because they haven't been selected by the user yet
  );
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<ITeam[] | null>(null);
  const themeMode = useThemeMode();
  const yearOptions = getYearOptions(2020, 30);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const {data:countries} = useSWR('https://cdn.slicevista.com/countries.json',fetcher)

  const classes = useStyles();

  const [dateState, setDateState] = useState<any>({
    date: new Date(),
  });
  // const navigate = useNavigate();

  useTeam((e) => {
    setTeams(e);
  });
  useMatch(id ?? "", (e) => {
    setInitData(e);
  });

  const [systemMode, setSystemMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
);

  let states: object[] = []
  countries?.forEach((country:any)=>{
    if(country.code3 === 'IND'){
      states = country.states
    }
  })

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

 useEffect(()=> {
  return () => {
    setInitData(initMatchVal)
    }
 },[id])

  return (
    <>
      {id ? <PageTitle description="" breadcrumbs={[]}>
        Edit Match
      </PageTitle> : <PageTitle description="" breadcrumbs={[]}>
        Add Match
      </PageTitle>}
      <div className="card mb-5 mb-xl-10">
        <div
          className="card-header border-0 cursor-pointer"
          role="button"
          data-bs-toggle="collapse"
          data-bs-target="#kt_account_profile_details"
          aria-expanded="true"
          aria-controls="kt_account_profile_details"
        >
          {id ?<div className="card-title m-0">
            <h3 className="fw-bolder m-0">Update Match</h3>
          </div> : 
          <div className="card-title m-0">
          <h3 className="fw-bolder m-0">Create Match</h3>
        </div>
          }
        </div>
        {/* Venue State */}
        <div id="kt_account_profile_details" className="collapse show">

        

        {/* {formikProps:any => ( */}
        <Formik
            initialValues={initData}
            validationSchema= {createMatchSchema}
            enableReinitialize={true}
            onSubmit={async (values) => {
              setLoading(true);
              await createOrUpdateMatch({
                values,
                id,
                onSuccess: () => {
                  toast.success("Match saved!");
                  navigate("/matches")
                },
                onError: (e) => toast.error(e),
                onEnd: () => setLoading(false),
              });

            }}
          >
          {(formik) => {
            {console.log("formik value inside match", formik)}
            return <Form>
            

            <div className="card-body border-top p-9">
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Venue State
                </label>

                <div className="col-lg-8 fv-row">
                  <select
                      className="form-select form-select-solid form-select-lg fw-bold"
                      id='states'
                      {...formik.getFieldProps("venueState")}
                      onChange={(e) => {
                        formik.setFieldValue('venueState', e.target.value);
                      }}
                  >
                    <option value="">Select Venue State</option>
                    {
                      states?.map((state:any) => (
                          <option key={state.code} value={state.name}>{state.name}</option>
                      ))
                    }
                  </select>


                  {formik.touched.venueState && formik.errors.venueState && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formik.errors.venueState}
                        </div>
                      </div>
                  )}
                </div>
              </div>
              {/* Team 1 Drop Down */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Team 1
                </label>

                <div className="col-lg-8 fv-row">
                  <select
                      className="form-select form-select-solid form-select-lg fw-bold"
                      value={
                        formik.values.team2
                          ? JSON.stringify(formik.values.team1)
                          : ""
                      }
                      onChange={(e) => {
                        formik.setFieldValue(`team${"1"}`, JSON.parse(e.target.value));
                        
                      }}
                  >
                    <option value="">Select Team 1</option>
                    {teams?.map((t) => (
                      
                      <option key={t.teamName} value={JSON.stringify(t)}>
                        {t.teamName}
                      </option>
                    ))}
                  </select>

                  {formik.touched.team1 && formik.errors.team1 && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">{formik.errors.team1}</div>
                    </div>
                  )}
                </div>
              </div>
              {/* Team 2 Drop Down */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Team 2
                </label>

                <div className="col-lg-8 fv-row">
                  <select
                    className="form-select form-select-solid form-select-lg fw-bold"
                    value={
                      formik.values.team2
                        ? JSON.stringify(formik.values.team2)
                        : ""
                    }
                    // {...formik.getFieldProps("formik.values.team2?.teamName")}
                    onChange={(e) => {
                      formik.setFieldValue(`team${"2"}`, JSON.parse(e.target.value));
                      
                    }}
                    
                  >
                    <option value="">Select Team 2</option>
                    {teams?.map((t) => (
                      <option key={t.teamName} value={JSON.stringify(t)}>
                        {t.teamName}
                      </option>
                    ))}
                  </select>

                  {formik.touched.team2 && formik.errors.team2 && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">{formik.errors.team2}</div>
                    </div>
                  )}
                </div>
              </div>
              {/* Match Date */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Match Date
                </label>
                <div className="col-lg-8 fv-row">
                <ThemeProvider 
                    theme={datePickerTheme}
                  >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                      <DateTimePicker
                          sx={{p:'10px',border:'0px',outline:'none'}}
                          
                            onChange={(date)=>{
                                formik.setFieldValue('matchDate', date?.toISOString());
                            }}
                            value={dayjs(formik.values.matchDate)}
                            className={`form-control form-control-solid ${themeMode.mode==='dark' || (themeMode.mode==='system' && systemMode)?classes.dark:classes.root}`}
                                                
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                  </ThemeProvider>

                  {formik.touched.matchDate && formik.errors.matchDate && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                         {formik.errors.matchDate}
                         
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Football League */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Football League
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                    type="text"
                    className="form-control form-control-lg form-control-solid"
                    placeholder="Football League"
                    {...formik.getFieldProps("footballLeague")}
                  />

                  {formik.touched.footballLeague &&
                    formik.errors.footballLeague && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formik.errors.footballLeague}
                        </div>
                      </div>
                    )}
                </div>
              </div>
              {/* Match Round */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Match Round
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                    type="text"
                    className="form-control form-control-lg form-control-solid"
                    placeholder="Match Round"
                    {...formik.getFieldProps("matchRound")}
                  />

                  {formik.touched.matchRound && formik.errors.matchRound && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formik.errors.matchRound}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Season
                </label>
                <div className="col-lg-8 fv-row">
                  

                  <select
                    className="form-select form-select-solid form-select-lg fw-bold"
                    {...formik.getFieldProps("seasonDate")}
                    onChange={(e) => formik.setFieldValue("seasonDate", e.target.value)}
                  >
                    <option value="">Select Season Year</option>
                    {yearOptions.map((yearRange) => (
                      <option key={yearRange} value={yearRange}>
                        {yearRange}
                      </option>
                    ))}
                  </select>

                  {formik.touched.seasonDate && formik.errors.seasonDate && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">{formik.errors.seasonDate}</div>
                    </div>
                  )}
                </div>
              </div>

              
              {/* Add Event and Add Stats Component */}
              {id && <><AddEvents {...formik} />
              <AddStats {...formik} />
              
              
              {/* Team 1 Score */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Team 1 Score
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                    type="number"
                    className="form-control form-control-lg form-control-solid"
                    placeholder="Team 1 Score"
                    {...formik.getFieldProps("matchResult.score.team1Score")}
                  />

                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <ErrorMessage name="matchResult.score.team1Score" />
                      </div>
                    </div>

                  
                </div>
              </div>

              {/* Team 2 Score */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Team 2 Score
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                    type="number"
                    className="form-control form-control-lg form-control-solid"
                    placeholder="Team 1 Score"
                    {...formik.getFieldProps("matchResult.score.team2Score")}
                  />

                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <ErrorMessage name="matchResult.score.team2Score" />
                      </div>
                    </div>

                  
                </div>
              </div>
              </>}
              
              {/* Team 1 Score */}
              {/* <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Team 1 Score
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                    type="number"
                    className="form-control form-control-lg form-control-solid"
                    placeholder="Team 1 Score"
                    {...formik.getFieldProps("matchResult.score.team1Score")}
                  />

                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <ErrorMessage name="matchResult.score.team1Score" />
                      </div>
                    </div>

                  
                </div>
              </div> */}

              {/* Team 2 Score */}
              {/* <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Team 2 Score
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                    type="number"
                    className="form-control form-control-lg form-control-solid"
                    placeholder="Team 1 Score"
                    {...formik.getFieldProps("matchResult.score.team2Score")}
                  />

                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <ErrorMessage name="matchResult.score.team2Score" />
                      </div>
                    </div>

                  
                </div>
              </div> */}
              
              

                
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
          </Form>
          }}
          </Formik>
          
          {/* )} */}
          
        </div>
      </div>
    </>
  );
};
