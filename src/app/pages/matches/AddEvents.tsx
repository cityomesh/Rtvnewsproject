import { ErrorMessage, Field, FieldArray, Form, Formik, FormikProps,useFormikContext } from "formik";

import { useEffect, useState } from "react";


import { KTIcon } from "../../../_metronic/helpers";

import { useNavigate, useParams } from "react-router-dom";

import { IMatch, IMatchEvents } from "./match";

import {
    initMatchEventsValues,
    // teamEvent,
    initTeamEvent,
    
  } from "./match.tsx";




// const AddEvents:React.FC<FormikProps<IMatch>> = ({values}) => {
const AddEvents:React.FC<FormikProps<IMatch>> = (formik) => {
    
    const navigate = useNavigate();
    const { id } = useParams();
    const [initData, setInitData] = useState<IMatchEvents>(initMatchEventsValues);

    return (
                                       
            <FieldArray name="matchResult.matchEvents">
                {({ remove, push }) => (
                <div className="accordion" id="questionsAccordion">

                    {formik.values.matchResult?.matchEvents?.map((event, index) => (
                        
                    <div key={index}>

                     {/* Event Heading */}
                    <div className="d-flex justify-content-between">
                        <label className="col-lg-4 col-form-label fw-bold fs-col-lg-4 col-form-label required fw-bold fs-6">
                            Event {index+1} 
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

                      <div className="row">
                            <label className="col-lg-4 col-form-label fw-bold fs-col-lg-4 col-form-label required fw-bold fs-6">
                                Event Team
                            </label>
                            <div className="col-lg-8">

                                <div role="group" aria-labelledby="gender-group" className="d-flex p-2">
                                    <div className="form-check d-flex align-items-center p-0">
                                        <Field type="radio" name={`matchResult.matchEvents.${index}.event1`} value="Team 1" className="text-justify ml-3" />
                                        <label
                                            className="form-check-label ms-2 mt-0 styled-text" // Use margin for gap
                                            htmlFor="Team 1"
                                        >
                                            Team 1
                                        </label>
                                     </div>

                                    <div className="form-check d-flex align-items-center pl-4">
                                    <Field type="radio" name={`matchResult.matchEvents.${index}.event1`} value="Team 2" />
                                    <label
                                        className="form-check-label ms-2 styled-text"
                                        htmlFor="Team 2"
                                    >
                                        Team 2
                                    </label>
                                    </div>


                                </div>

                                <div className="fv-plugins-message-container">
                                <div className="fv-help-block">
                                    <ErrorMessage
                                    name={`matchResult.matchEvents.${index}.event1`}
                                    component="div"
                                    className="fv-help-block"
                                    />
                                </div>
                                </div>
                            </div>



                        </div>

                        <div className="row">
                            
                            {/* Event Second Input Field */}
                            <label className="col-lg-4 col-form-label fw-bold fs-col-lg-4 col-form-label required fw-bold fs-6">
                                    Event Name
                            </label>
                            
                            <div className="col-lg-8">
                                <Field
                                    type="text"
                                    className="form-control form-control-lg form-control-solid"
                                    placeholder="Enter Player Name"
                                    {...formik.getFieldProps(`matchResult.matchEvents.${index}.event2`)}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        formik.setFieldValue(`matchResult.matchEvents.${index}.event2`, e.target.value);
                                    }}
                                    
                                />
                                <div className="fv-plugins-message-container">
                                    <div className="fv-help-block">
                                        <ErrorMessage
                                        name={`matchResult.matchEvents.${index}.event2`}
                                        component="div"
                                        className="fv-help-block"
                                        />
                                    </div>
                                </div>
                            </div>

                            
                        </div>

                        {/* Event type Input Field */}
                        <div className="row">

                            <label className="col-lg-4 col-form-label fw-bold fs-col-lg-4 col-form-label required fw-bold fs-6">
                                    Event Type
                            </label>
                            
                            <div className="col-lg-8 fv-row ">
                                <Field as="select"
                                    className="form-select form-select-solid form-select-lg fw-bold"
                                    placeholder="Enter a label"
                                    {...formik.getFieldProps(`matchResult.matchEvents.${index}.type`)}
                                    
                                    onChange={(e:any) => {
                                        formik.setFieldValue(`matchResult.matchEvents.${index}.type`, e.target.value);

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
                                    name={`matchResult.matchEvents.${index}.type`}
                                    component="div"
                                    className="fv-help-block"
                                    />
                                </div>
                                </div>
                            </div>

                            
                        </div>
                    </div>
                
                

                    ))}

                    {/* Add new event form button*/}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom:"15px" }}>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => {
                                
                                push(initTeamEvent)
                            }}
                        >
                            Add Event
                        </button>
                        <br />
                        <br />
                    </div>
                </div>
                )}
            </FieldArray>
            
        
    );
}
export default AddEvents;