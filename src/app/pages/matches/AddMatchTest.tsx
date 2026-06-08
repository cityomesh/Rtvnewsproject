import { PageTitle } from "../../../_metronic/layout/core";
import { KTIcon } from "../../../_metronic/helpers";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
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
import { createOrUpdateMatch, useMatch, useTeam } from "./match-controller.ts";
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
import {makeStyles} from "@mui/styles";
import dayjs, { Dayjs } from 'dayjs';

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

export const AddMatchTest = () => {
  const classes = useStyles();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
 
 
  const {data:countries} = useSWR('https://cdn.slicevista.com/countries.json',fetcher)
  let states: object[] = []
  countries?.forEach((country:any)=>{
    if(country.code3 === 'IND'){
      states = country.states
    }
  })
  console.log('STATES',states);
  const { id } = useParams();
  const [initData, setInitData] = useState<IMatch>(
    initMatchVal //this sets initial values of team1 and team2 to null, because they haven't been selected by the user yet
  );
  const [teams, setTeams] = useState<ITeam[] | null>(null);

  const [loading, setLoading] = useState(false);
  const [dateState, setDateState] = useState<any>({
    date: new Date(),
  });
  const navigate = useNavigate();

  useTeam((e) => {
    setTeams(e);
  });
  useMatch(id ?? "", (e) => {
    setInitData(e);
    console.log("for initial data",initData);
  });

  // const formik = useFormik<IMatch>({
  //   initialValues: initData,
  //   validationSchema: createMatchSchema,
  //   enableReinitialize: true,
    
    
  // });

// console.log("addmatchformik value", formik);
  

  // const handleSelectChange = (myStringifyObject: string, teamNum: number) => {
  //   if (myStringifyObject != "") {
  //     const myObject = JSON.parse(myStringifyObject);
  //     formik.setFieldValue(`team${teamNum}`, myObject);
  //   }
  // };

  // const handleDate = (date: Date) => {
  //   const formattedDate = date.toISOString();
  //   formik.setFieldValue("matchDate", formattedDate);
  // };

  // const handleSubmit = (val:any) => {
  //   console.log("formik submit value",val);
  // }

  // const fromik = formik.values.matchResult;
  // console.log("match events value", fromik);

 

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
              // debugger;
              // console.log("values")
              // console.log("values comes after", values)
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
            // console.log(values);

            }}
          >
          {(formik) => {
            
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
                      // value={
                      //   formik.values.team1
                      //       ? JSON.stringify(formik.values.team1)
                      //       : ""
                      // }

                      {...formik.getFieldProps("formik.values.team1")}
                      
                      onChange={(e) => {
                        formik.setFieldValue(`team${"1"}`, JSON.parse(e.target.value));
                        
                      }}
                      // onChange={(evt) => 
                      //   handleSelectChange(evt.target.value, 1)}
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
                    // value={
                    //   formik.values.team2
                    //     ? JSON.stringify(formik.values.team2)
                    //     : ""
                    // }

                    {...formik.getFieldProps("formik.values.team2")}
                    onChange={(e) => {
                      formik.setFieldValue(`team${"2"}`, JSON.parse(e.target.value));
                    }}
                    // onChange={(evt) => handleSelectChange(evt.target.value, 2)}
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
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DateTimePicker
                          sx={{p:'10px',border:'0px',outline:'none'}}
                          // slotProps={{
                          //   openPickerIcon: { fontSize: 'large' },
                          //   textField: {
                          //     variant: 'standard',
                          //     focused: true,
                          //     inputProps: {disableUnderline: true}
                          //   },
                          // }}
                            onChange={(date)=>{
                                formik.setFieldValue('matchDate', date?.toISOString());
                            }}
                            value={dayjs(formik.values.matchDate)}
                          className={`form-control form-control-solid ${classes.root}`}
                      />
                    </DemoContainer>
                  </LocalizationProvider>

                  {formik.touched.matchDate && formik.errors.matchDate && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                         {formik.errors.matchDate}
                         {/*    <ErrorMessage name="matchDate" />*/}
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

                <div className="col-lg-8 fv-row bg-light">
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

              
            
              <AddEvents {...formik} />
              <AddStats {...formik} />
              {/* <AddEvents matchEvents={formikProps.values.matchResult?.matchEvents} /> */}
              {/* <AddEvents matchEvents={formikProps.values.matchResult} setFieldValue={formikProps.setFieldValue}/> */}
              {/* {console.log("addmatchformik value", formikProps)} */}
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

                  {/* {formik.touched.matchResult?.score?.team1score &&
                    formik.errors.matchResult?.score?.team1score && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formik.errors?.matchResult?.score?.team1score}
                        </div>
                      </div>
                    )} */}
                </div>
              </div>

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

                  {/* {formik.touched.matchResult?.score?.team1score &&
                    formik.errors.matchResult?.score?.team1score && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formik.errors?.matchResult?.score?.team1score}
                        </div>
                      </div>
                    )} */}
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
          </Form>
          }}
          </Formik>
          
          {/* )} */}
          
        </div>
      </div>
    </>
  );
};
