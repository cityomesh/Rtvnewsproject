import { ErrorMessage, Field, FieldArray, Form, Formik, FormikProps } from "formik";
import { useEffect, useState } from "react";
import { KTIcon } from "../../../_metronic/helpers";
import { useNavigate, useParams } from "react-router-dom";
import { IMatch, IMatchEvents } from "./match";

import {
    initMatchEventsValues,
    // teamEvent,
    initTeamStat
    
  } from "./match.tsx";



const AddStats:React.FC<FormikProps<IMatch>> = (formik) => {

    return (
            
                                        
            <FieldArray name="matchResult.stats">
                
                {({ remove, push }) => (
                <div className="accordion" id="questionsAccordion">
                    
                    {formik.values.matchResult?.stats?.map((event, index) => (
                        
                    <div key={index}>
                        
                        
                    {/* Stats heading  */}
                    <div className="d-flex justify-content-between">
                        <label className="col-lg-4 col-form-label fw-bold fs-col-lg-4 col-form-label required fw-bold fs-6">
                            Stats {index+1} 
                        </label>
                        <div className="">
                            <button
                                type="button"
                                className="btn"
                                onClick={() => remove(index)}
                                >
                                <KTIcon
                                    iconName={"trash"}
                                    className="text-danger fs-2 "
                                />
                            </button>
                        </div>
                    </div>

                    {/* Stats input field */}
                    <div style={{padding: '16px 32px'}}>
                            
                        {/* Team 1 input field */}
                        <div className="row">
                            <label className="col-lg-4 col-form-label fw-bold fs-col-lg-4 col-form-label required fw-bold fs-6">
                                Team 1 Value 
                            </label>
                            <div className="col-lg-8 ">
                                <Field
                                    type="number"
                                    // name={`matchResult.stats.${index}.team1value`}
                                    className="form-control form-control-lg form-control-solid"
                                    placeholder="Enter Team 1 value"
                                    {...formik.getFieldProps(`matchResult.stats.${index}.team1value`)}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        formik.setFieldValue(`matchResult.stats.${index}.team1value`, e.target.value);
                                    }}
                                />
                                <div className="fv-plugins-message-container">
                                <div className="fv-help-block">
                                    <ErrorMessage
                                    name={`matchResult.stats.${index}.team1value`}
                                    component="div"
                                    className="fv-help-block"
                                    />
                                </div>
                                </div>
                            </div>

                            
                            
                        </div>

                        <div className="row">
                            
                            {/* Team 2 input field */}
                            <label className="col-lg-4 col-form-label fw-bold fs-col-lg-4 col-form-label required fw-bold fs-6">
                                    Team 2 Value
                            </label>
                            
                            <div className="col-lg-8">
                                <Field
                                    type="number"
                                    // name={`matchResult.stats.${index}.team2value`}
                                    className="form-control form-control-lg form-control-solid"
                                    placeholder="Enter Team 2 value"
                                    {...formik.getFieldProps(`matchResult.stats.${index}.team2value`)}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        formik.setFieldValue(`matchResult.stats.${index}.team2value`, e.target.value);
                                    }}
                                    
                                />
                                <div className="fv-plugins-message-container">
                                <div className="fv-help-block">
                                    <ErrorMessage
                                    name={`event.${index}.team2value`}
                                    component="div"
                                    className="fv-help-block"
                                    />
                                </div>
                                </div>
                            </div>

                            
                        </div>

                        <div className="row">

                            {/* Stats type input */}
                            <label className="col-lg-4 col-form-label fw-bold fs-col-lg-4 col-form-label required fw-bold fs-6">
                                    Type
                            </label>
                            
                            <div className="col-lg-8 fv-row ">
                                <Field as="select"
                                    className="form-select form-select-solid form-select-lg fw-bold"
                                    placeholder="Enter Type"
                                    {...formik.getFieldProps(`matchResult.stats.${index}.type`)}
                                    onChange={(e: any) => {
                                        formik.setFieldValue(`matchResult.stats.${index}.type`, e.target.value);
                                    }}
                                    
                                    >

                                    <option value="">Select Type</option>
                                    <option value="CORNERS">CORNERS</option>
                                    <option value="GOALS">GOALS</option>
                                    <option value="SHOTS">SHOTS</option>
                                    <option value="SHOTSONTARGET">SHOTSONTARGET</option>
                                    <option value="POSSESSION">POSSESSION</option>
                                    <option value="PASSES">PASSES</option>
                                    <option value="PASSACCURACY">PASSACCURACY</option>
                                    <option value="FOULS">FOULS</option>
                                    <option value="yellow_card">YELLOW_CARD</option>
                                    <option value="red_card">RED_CARD</option>
                                    <option value="null">null</option>      
                                </Field>
                                <div className="fv-plugins-message-container">
                                <div className="fv-help-block">
                                    <ErrorMessage
                                    name={`matchResult.stats.${index}.type`}
                                    component="div"
                                    className="fv-help-block"
                                    />
                                </div>
                                </div>
                            </div>

                            
                        </div>
                    </div>
                {/* </h2> */}
                
                    </div>
                    ))}

                    {/* Add new stats form button */}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom:"15px" }}>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => {
                                push(initTeamStat)
                            }}
                        >
                            Add Stats
                        </button>
                        <br />
                        <br />
                    </div>
                </div>
                )}
            </FieldArray>
              
            
        
    );
}
export default AddStats;