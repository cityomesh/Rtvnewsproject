// /* eslint-disable @typescript-eslint/ban-ts-comment */
// import { PageTitle } from "../../../_metronic/layout/core";
// import { KTIcon } from "../../../_metronic/helpers";
// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { useParams } from "react-router";
// import { useQuiz, createOrUpdateQuiz } from "./quiz-controller.ts";

// import {
//   ErrorMessage,
//   Formik,
//   Form,
//   Field,
//   FieldArray,
// } from "formik";
// import {
//   createQuizSchema,
//   initOptionVal,
//   initQuestionVal,
//   initQuizVal,
//   IQuiz,
// } from "./quiz.tsx";

// import "./style.css";
// import CancelButton from "../../common/cancelButton.tsx";

// // MUI components for notification checkbox
// import { Typography, FormControlLabel, Checkbox } from "@mui/material";

// const AddQuiz = () => {
//   const { id } = useParams();
//   const [initData, setInitData] = useState<IQuiz>(initQuizVal);
//   const [loading, setLoading] = useState(false);
//   const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
//   const [sendNotification, setSendNotification] = useState(false); // ✅ Notification state
//   const navigate = useNavigate();

//   const key = localStorage.getItem("kt_theme_mode_menu");
//   console.log(key);

//   useQuiz(id ?? "", (e) => {
//     if (id) {
//       setInitData(e);
//     } else {
//       setInitData(initQuizVal);
//     }
//   });

//   useEffect(() => {
//     if (!id) {
//       setExpandedIndex(0);
//     }
//     return () => {
//       setInitData(initQuizVal);
//     };
//   }, [id]);

//   return (
//     <>
//       <div className="card mb-5 mb-xl-10">
//         <div
//           className="card-header border-0 cursor-pointer"
//           role="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#kt_account_profile_details"
//           aria-expanded="true"
//           aria-controls="kt_account_profile_details"
//         >
//           {id ? (
//             <div className="card-title m-0">
//               <h3 className="fw-bolder m-0"> Edit Quiz</h3>
//             </div>
//           ) : (
//             <div className="card-title m-0">
//               <h3 className="fw-bolder m-0">Add Quiz</h3>
//             </div>
//           )}
//         </div>

//         <div id="kt_account_profile_details" className="collapse show">
//           <Formik
//             initialValues={initData}
//             validationSchema={createQuizSchema}
//             enableReinitialize={true}
//             onSubmit={async (values) => {
//               setLoading(true);
//               const payload = {
//                 ...values,
//                 questions: values.questions.map((q) => ({
//                   ...q,
//                   options: q.options.map((opt) => ({
//                     ...opt,
//                     answered: opt.correctAnswer,
//                   })),
//                 })),
//               };

//               // ✅ Determine notify parameter based on checkbox
//               const notifyParam = sendNotification ? "true" : "false";

//               await createOrUpdateQuiz({
//                 values: payload,
//                 id,
//                 notify: notifyParam,   // ✅ Pass notify flag to controller
//                 onSuccess: () => {
//                   toast.success("Quiz Is Saved!");
//                   navigate("/quiz");
//                 },
//                 onError: (e) => {
//                   console.error("API error:", e);
//                   toast.error(e);
//                 },
//                 onEnd: () => {
//                   console.log("API ended");
//                   setLoading(false);
//                 },
//               });
//             }}
//           >
//             {(formik) => (
//               <Form>
//                 <div className="card-body border-top p-9 flexible-quiz-container">
//                   <div className="quiz-form-scrollable">
//                     <div className="row mb-6">
//                       <label className="col-lg-4 col-form-label required fw-bold fs-6">
//                         Quiz Status
//                       </label>
//                       <div className="col-lg-8 fv-row">
//                         <select
//                           className="form-select form-select-lg form-select-solid"
//                           {...formik.getFieldProps("status")}
//                         >
//                           <option value="">Select status</option>
//                           <option value="ACTIVE">Live Now</option>
//                           <option value="INACTIVE">Save In Draft</option>
//                         </select>
//                         <div className="fv-plugins-message-container">
//                           <div className="fv-help-block">
//                             <ErrorMessage name="status" />
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="row mb-6">
//                       <label className="col-lg-4 col-form-label required fw-bold fs-6">
//                         Reward coins per question
//                       </label>
//                       <div className="col-lg-8 fv-row">
//                         <input
//                           type="number"
//                           className="form-control form-control-lg form-control-solid"
//                           placeholder="Reward coins per question"
//                           {...formik.getFieldProps("rewardCoinsPerQuestion")}
//                         />
//                         <div className="fv-plugins-message-container">
//                           <div className="fv-help-block">
//                             <ErrorMessage name="rewardCoinsPerQuestion" />
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <FieldArray name="questions">
//                       {({ remove, push }) => (
//                         <div className="accordion" id="questionsAccordion">
//                           <div className="row">
//                             <label className="col-lg-4 col-form-label required fw-bold fs-6">
//                               Questions
//                             </label>
//                             <div className="col-lg-4 fv-plugins-message-container">
//                               <div className="fv-help-block">
//                                 {typeof formik.errors.questions !== "object" && (
//                                   <ErrorMessage name="questions" />
//                                 )}
//                               </div>
//                             </div>
//                             <div
//                               className="col-lg-4"
//                               style={{
//                                 display: "flex",
//                                 justifyContent: "flex-end",
//                                 marginBottom: "15px",
//                               }}
//                             >
//                               <button
//                                 type="button"
//                                 className="btn btn-success"
//                                 onClick={() => {
//                                   push(initQuestionVal);
//                                   setExpandedIndex(formik.values.questions.length);
//                                 }}
//                               >
//                                 Add Question
//                               </button>
//                               <br />
//                               <br />
//                             </div>
//                           </div>

//                           {formik.values.questions.map((question, index) => (
//                             <div
//                               key={index}
//                               style={{ borderRadius: "10px" }}
//                               className="accordion-item mb-6 light-container"
//                             >
//                               <h2 className="accordion-header" id={`heading${index}`}>
//                                 <button
//                                   style={{ borderRadius: "10px" }}
//                                   className={`question-container accordion-button ${
//                                     expandedIndex === index ? "" : "collapsed"
//                                   } light-container`}
//                                   type="button"
//                                   data-bs-toggle="collapse"
//                                   data-bs-target={`#collapse${index}`}
//                                   aria-expanded={expandedIndex === index ? "true" : "false"}
//                                   aria-controls={`collapse${index}`}
//                                   onClick={() =>
//                                     setExpandedIndex(expandedIndex === index ? null : index)
//                                   }
//                                 >
//                                   <label className="col-form-label fw-bold fs-6">
//                                     Question {index + 1}: {formik.values.questions[index].question}
//                                   </label>
//                                 </button>
//                               </h2>

//                               <div
//                                 id={`collapse${index}`}
//                                 className={`accordion-collapse collapse ${
//                                   expandedIndex === index ? "show" : ""
//                                 }`}
//                                 aria-labelledby={`heading${index}`}
//                                 data-bs-parent="#questionsAccordion"
//                               >
//                                 <div className="accordion-body px-2 py-4 px-md-4">
//                                   <div className="row mb-6 align-items-center">
//                                     <label className="col-lg-3 col-form-label required fw-bold fs-6">
//                                       Question{" "}
//                                       <span style={{ color: "#aaaaaa" }}>
//                                         ({question.question.length}/80)
//                                       </span>
//                                     </label>
//                                     <div className="col-lg-9 fv-row">
//                                       <div className="d-flex align-items-center">
//                                         <Field
//                                           type="text"
//                                           name={`questions[${index}].question`}
//                                           className="form-control form-control-lg form-control-solid me-3"
//                                           placeholder="Enter a question"
//                                           maxLength={80}
//                                           style={{ backgroundColor: "#f1f1f4 " }}
//                                         />
//                                         <button
//                                           type="button"
//                                           className="btn btn-bg-light"
//                                           onClick={() => remove(index)}
//                                         >
//                                           <KTIcon iconName={"trash"} className="text-danger fs-2" />
//                                         </button>
//                                       </div>
//                                       <div className="fv-plugins-message-container">
//                                         <div className="fv-help-block">
//                                           <ErrorMessage
//                                             name={`questions[${index}].question`}
//                                             component="div"
//                                             className="text-danger"
//                                           />
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>

//                                   <FieldArray name={`questions[${index}].options`}>
//                                     {({ remove: removeOption, push: pushOption }) => (
//                                       <>
//                                         <div className="mb-4">
//                                           <label className="col-form-label required fw-bold fs-6">
//                                             Add Your options
//                                           </label>
//                                           <div className="fv-plugins-message-container">
//                                             <div className="fv-help-block">
//                                               {formik.errors.questions &&
//                                                 typeof formik.errors.questions[index] === "object" &&
//                                                 typeof (formik.errors.questions[index] as any).options !== "object" && (
//                                                   <ErrorMessage
//                                                     name={`questions[${index}].options`}
//                                                     component="div"
//                                                     className="text-danger"
//                                                   />
//                                                 )}
//                                             </div>
//                                           </div>
//                                         </div>

//                                         {question.options.map((option, optionIndex) => (
//                                           <div key={optionIndex} className="mb-4">
//                                             <div className="row g-1 align-items-center flex-nowrap option-row">
//                                               <div className="col-auto">
//                                                 <Field
//                                                   type="radio"
//                                                   className="form-check-input"
//                                                   name={`questions[${index}].selectedCorrectAnswer`}
//                                                   value={String(optionIndex)}
//                                                   checked={option.correctAnswer}
//                                                   onChange={() => {
//                                                     question.options.forEach((_, idx) => {
//                                                       formik.setFieldValue(
//                                                         `questions[${index}].options[${idx}].correctAnswer`,
//                                                         false
//                                                       );
//                                                     });
//                                                     formik.setFieldValue(
//                                                       `questions[${index}].options[${optionIndex}].correctAnswer`,
//                                                       true
//                                                     );
//                                                     formik.setFieldValue(
//                                                       `questions[${index}].selectedCorrectAnswer`,
//                                                       String(optionIndex)
//                                                     );
//                                                   }}
//                                                 />
//                                               </div>

//                                               <div className="col-auto">
//                                                 <label className="col-form-label required fw-bold fs-6 mb-0">
//                                                   {option.correctAnswer ? (
//                                                     <span className="text-success">Correct</span>
//                                                   ) : (
//                                                     `Option ${optionIndex + 1}`
//                                                   )}
//                                                 </label>
//                                               </div>

//                                               <div className="col">
//                                                 <Field
//                                                   type="text"
//                                                   name={`questions[${index}].options[${optionIndex}].label`}
//                                                   className="form-control form-control-lg form-control-solid"
//                                                   placeholder="Option text"
//                                                   maxLength={36}
//                                                   style={{ backgroundColor: "#f1f1f4 !important" }}
//                                                 />
//                                               </div>

//                                               <div className="col-auto">
//                                                 <button
//                                                   type="button"
//                                                   className="btn btn-bg-light"
//                                                   onClick={() => removeOption(optionIndex)}
//                                                 >
//                                                   <KTIcon
//                                                     iconName={"trash"}
//                                                     className="text-danger fs-2"
//                                                   />
//                                                 </button>
//                                               </div>
//                                             </div>

//                                             <div className="row g-1 flex-nowrap">
//                                               <div className="col-auto" style={{ visibility: "hidden" }}>
//                                                 <input type="radio" className="form-check-input" />
//                                               </div>
//                                               <div className="col-auto" style={{ visibility: "hidden" }}>
//                                                 <label className="col-form-label required fw-bold fs-6 mb-0">
//                                                   Option X
//                                                 </label>
//                                               </div>
//                                               <div className="col d-flex justify-content-between">
//                                                 <ErrorMessage
//                                                   name={`questions[${index}].options[${optionIndex}].label`}
//                                                   component="div"
//                                                   className="text-danger"
//                                                 />
//                                                 <div className="flex-grow-1"></div>
//                                                 <div className="form-text text-muted">
//                                                   {option.label.length}/36
//                                                 </div>
//                                               </div>
//                                               <div className="col-auto" style={{ visibility: "hidden" }}>
//                                                 <button type="button" className="btn btn-bg-light">
//                                                   <KTIcon iconName={"trash"} className="fs-2" />
//                                                 </button>
//                                               </div>
//                                             </div>
//                                           </div>
//                                         ))}

//                                         {question.options.length < 5 && (
//                                           <div className="d-flex justify-content-center mt-5">
//                                             <button
//                                               type="button"
//                                               style={{
//                                                 borderColor: "grey",
//                                                 borderWidth: "1px",
//                                                 borderStyle: "solid",
//                                               }}
//                                               className="btn light-container"
//                                               onClick={() => pushOption(initOptionVal)}
//                                             >
//                                               Add a new option
//                                             </button>
//                                           </div>
//                                         )}
//                                       </>
//                                     )}
//                                   </FieldArray>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </FieldArray>

//                     {/* ✅ Send Notification Section (exactly like NewsFormDetails) */}
//                     <div className="mt-6 mb-6">
//                       <FormControlLabel
//                         control={
//                           <Checkbox
//                             checked={sendNotification}
//                             onChange={(e) => setSendNotification(e.target.checked)}
//                             name="sendNotification"
//                             color="primary"
//                             // You can add a disable condition here if needed, e.g., disabled={!formik.values.title || !formik.values.description}
//                           />
//                         }
//                         label={
//                           <Typography variant="body1" sx={{ fontWeight: 600, fontSize: "1.075rem" }}>
//                             Send Notification
//                           </Typography>
//                         }
//                       />
//                       <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 4 }}>
//                         Check this to send push notifications to users when the quiz is {id ? "updated" : "published"}.
//                       </Typography>
//                     </div>
//                   </div>
//                 </div>

//                 <div
//                   className="card-footer position-sticky d-flex justify-content-end py-6 px-1"
//                   style={{ marginRight: "20px" }}
//                 >
//                   <CancelButton />
//                   <button type="submit" className="btn btn-primary" disabled={loading}>
//                     {!loading && "Save"}
//                     {loading && (
//                       <span className="indicator-progress" style={{ display: "block" }}>
//                         Please wait...{" "}
//                         <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
//                       </span>
//                     )}
//                   </button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AddQuiz;





/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PageTitle } from "../../../_metronic/layout/core";
import { KTIcon } from "../../../_metronic/helpers";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { useQuiz, createOrUpdateQuiz } from "./quiz-controller.ts";

import {
  ErrorMessage,
  Formik,
  Form,
  Field,
  FieldArray,
} from "formik";
import {
  createQuizSchema,
  initOptionVal,
  initQuestionVal,
  initQuizVal,
  IQuiz,
} from "./quiz.tsx";

import "./style.css";
import CancelButton from "../../common/cancelButton.tsx";

// MUI components for notification checkbox
import { Typography, FormControlLabel, Checkbox } from "@mui/material";
import { getCurrentUser } from "../../modules/auth/session.ts";

const AddQuiz = () => {
  const { id } = useParams();
  const [initData, setInitData] = useState<IQuiz>(initQuizVal);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [sendNotification, setSendNotification] = useState(false);
  const navigate = useNavigate();

  const key = localStorage.getItem("kt_theme_mode_menu");
  console.log(key);

  useQuiz(id ?? "", (e) => {
    if (id) {
      setInitData(e);
    } else {
      setInitData(initQuizVal);
    }
  });

  useEffect(() => {
    if (!id) {
      setExpandedIndex(0);
    }
    return () => {
      setInitData(initQuizVal);
    };
  }, [id]);

  return (
    <>
      <div className="card mb-5 mb-xl-10">
        <div
          className="card-header border-0 cursor-pointer"
          role="button"
          data-bs-toggle="collapse"
          data-bs-target="#kt_account_profile_details"
          aria-expanded="true"
          aria-controls="kt_account_profile_details"
        >
          {id ? (
            <div className="card-title m-0">
              <h3 className="fw-bolder m-0"> Edit Quiz</h3>
            </div>
          ) : (
            <div className="card-title m-0">
              <h3 className="fw-bolder m-0">Add Quiz</h3>
            </div>
          )}
        </div>

        <div id="kt_account_profile_details" className="collapse show">
          <Formik
            initialValues={initData}
            validationSchema={createQuizSchema}
            enableReinitialize={true}
            onSubmit={async (values) => {
              setLoading(true);
              const payload = {
                ...values,
                questions: values.questions.map((q) => ({
                  ...q,
                  options: q.options.map((opt) => ({
                    ...opt,
                    answered: opt.correctAnswer,
                  })),
                })),
              };

              const notifyParam = sendNotification ? "true" : "false";

              await createOrUpdateQuiz({
                values: payload,
                id,
                notify: notifyParam,
                onSuccess: (responseData?: any) => {
                  toast.success("Quiz Is Saved!");
                  const currentUser = getCurrentUser();
                  const creator = currentUser?.username || 'unknown';
                  let quizId = id; // editing existing quiz
                  if (!id && responseData?.id) {
                    quizId = responseData.id;
                  }
                  if (quizId) {
                    const existing = localStorage.getItem('quiz_creators');
                    const creators = existing ? JSON.parse(existing) : {};
                    creators[quizId] = creator;
                    localStorage.setItem('quiz_creators', JSON.stringify(creators));
                    console.log(`Stored quiz creator: ${quizId} -> ${creator}`);
                  }
                  navigate("/quiz");
                },
                onError: (e) => {
                  console.error("API error:", e);
                  toast.error(e);
                },
                onEnd: () => {
                  console.log("API ended");
                  setLoading(false);
                },
              });
            }}
          >
            {(formik) => (
              <Form>
                <div className="card-body border-top p-9 flexible-quiz-container">
                  <div className="quiz-form-scrollable">
                    <div className="row mb-6">
                      <label className="col-lg-4 col-form-label required fw-bold fs-6">
                        Quiz Status
                      </label>
                      <div className="col-lg-8 fv-row">
                        <select
                          className="form-select form-select-lg form-select-solid"
                          {...formik.getFieldProps("status")}
                        >
                          <option value="">Select status</option>
                          <option value="ACTIVE">Live Now</option>
                          <option value="INACTIVE">Save In Draft</option>
                        </select>
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            <ErrorMessage name="status" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-6">
                      <label className="col-lg-4 col-form-label required fw-bold fs-6">
                        Reward coins per question
                      </label>
                      <div className="col-lg-8 fv-row">
                        <input
                          type="number"
                          className="form-control form-control-lg form-control-solid"
                          placeholder="Reward coins per question"
                          {...formik.getFieldProps("rewardCoinsPerQuestion")}
                        />
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            <ErrorMessage name="rewardCoinsPerQuestion" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <FieldArray name="questions">
                      {({ remove, push }) => (
                        <div className="accordion" id="questionsAccordion">
                          <div className="row">
                            <label className="col-lg-4 col-form-label required fw-bold fs-6">
                              Questions
                            </label>
                            <div className="col-lg-4 fv-plugins-message-container">
                              <div className="fv-help-block">
                                {typeof formik.errors.questions !== "object" && (
                                  <ErrorMessage name="questions" />
                                )}
                              </div>
                            </div>
                            <div
                              className="col-lg-4"
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginBottom: "15px",
                              }}
                            >
                              <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => {
                                  push(initQuestionVal);
                                  setExpandedIndex(formik.values.questions.length);
                                }}
                              >
                                Add Question
                              </button>
                              <br />
                              <br />
                            </div>
                          </div>

                          {formik.values.questions.map((question, index) => (
                            <div
                              key={index}
                              style={{ borderRadius: "10px" }}
                              className="accordion-item mb-6 light-container"
                            >
                              <h2 className="accordion-header" id={`heading${index}`}>
                                <button
                                  style={{ borderRadius: "10px" }}
                                  className={`question-container accordion-button ${
                                    expandedIndex === index ? "" : "collapsed"
                                  } light-container`}
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target={`#collapse${index}`}
                                  aria-expanded={expandedIndex === index ? "true" : "false"}
                                  aria-controls={`collapse${index}`}
                                  onClick={() =>
                                    setExpandedIndex(expandedIndex === index ? null : index)
                                  }
                                >
                                  <label className="col-form-label fw-bold fs-6">
                                    Question {index + 1}: {formik.values.questions[index].question}
                                  </label>
                                </button>
                              </h2>

                              <div
                                id={`collapse${index}`}
                                className={`accordion-collapse collapse ${
                                  expandedIndex === index ? "show" : ""
                                }`}
                                aria-labelledby={`heading${index}`}
                                data-bs-parent="#questionsAccordion"
                              >
                                <div className="accordion-body px-2 py-4 px-md-4">
                                  <div className="row mb-6 align-items-center">
                                    <label className="col-lg-3 col-form-label required fw-bold fs-6">
                                      Question{" "}
                                      <span style={{ color: "#aaaaaa" }}>
                                        ({question.question.length}/80)
                                      </span>
                                    </label>
                                    <div className="col-lg-9 fv-row">
                                      <div className="d-flex align-items-center">
                                        <Field
                                          type="text"
                                          name={`questions[${index}].question`}
                                          className="form-control form-control-lg form-control-solid me-3"
                                          placeholder="Enter a question"
                                          maxLength={80}
                                          style={{ backgroundColor: "#f1f1f4 " }}
                                        />
                                        <button
                                          type="button"
                                          className="btn btn-bg-light"
                                          onClick={() => remove(index)}
                                        >
                                          <KTIcon iconName={"trash"} className="text-danger fs-2" />
                                        </button>
                                      </div>
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          <ErrorMessage
                                            name={`questions[${index}].question`}
                                            component="div"
                                            className="text-danger"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <FieldArray name={`questions[${index}].options`}>
                                    {({ remove: removeOption, push: pushOption }) => (
                                      <>
                                        <div className="mb-4">
                                          <label className="col-form-label required fw-bold fs-6">
                                            Add Your options
                                          </label>
                                          <div className="fv-plugins-message-container">
                                            <div className="fv-help-block">
                                              {formik.errors.questions &&
                                                typeof formik.errors.questions[index] === "object" &&
                                                typeof (formik.errors.questions[index] as any).options !== "object" && (
                                                  <ErrorMessage
                                                    name={`questions[${index}].options`}
                                                    component="div"
                                                    className="text-danger"
                                                  />
                                                )}
                                            </div>
                                          </div>
                                        </div>

                                        {question.options.map((option, optionIndex) => (
                                          <div key={optionIndex} className="mb-4">
                                            <div className="row g-1 align-items-center flex-nowrap option-row">
                                              <div className="col-auto">
                                                <Field
                                                  type="radio"
                                                  className="form-check-input"
                                                  name={`questions[${index}].selectedCorrectAnswer`}
                                                  value={String(optionIndex)}
                                                  checked={option.correctAnswer}
                                                  onChange={() => {
                                                    question.options.forEach((_, idx) => {
                                                      formik.setFieldValue(
                                                        `questions[${index}].options[${idx}].correctAnswer`,
                                                        false
                                                      );
                                                    });
                                                    formik.setFieldValue(
                                                      `questions[${index}].options[${optionIndex}].correctAnswer`,
                                                      true
                                                    );
                                                    formik.setFieldValue(
                                                      `questions[${index}].selectedCorrectAnswer`,
                                                      String(optionIndex)
                                                    );
                                                  }}
                                                />
                                              </div>

                                              <div className="col-auto">
                                                <label className="col-form-label required fw-bold fs-6 mb-0">
                                                  {option.correctAnswer ? (
                                                    <span className="text-success">Correct</span>
                                                  ) : (
                                                    `Option ${optionIndex + 1}`
                                                  )}
                                                </label>
                                              </div>

                                              <div className="col">
                                                <Field
                                                  type="text"
                                                  name={`questions[${index}].options[${optionIndex}].label`}
                                                  className="form-control form-control-lg form-control-solid"
                                                  placeholder="Option text"
                                                  maxLength={36}
                                                  style={{ backgroundColor: "#f1f1f4 !important" }}
                                                />
                                              </div>

                                              <div className="col-auto">
                                                <button
                                                  type="button"
                                                  className="btn btn-bg-light"
                                                  onClick={() => removeOption(optionIndex)}
                                                >
                                                  <KTIcon
                                                    iconName={"trash"}
                                                    className="text-danger fs-2"
                                                  />
                                                </button>
                                              </div>
                                            </div>

                                            <div className="row g-1 flex-nowrap">
                                              <div className="col-auto" style={{ visibility: "hidden" }}>
                                                <input type="radio" className="form-check-input" />
                                              </div>
                                              <div className="col-auto" style={{ visibility: "hidden" }}>
                                                <label className="col-form-label required fw-bold fs-6 mb-0">
                                                  Option X
                                                </label>
                                              </div>
                                              <div className="col d-flex justify-content-between">
                                                <ErrorMessage
                                                  name={`questions[${index}].options[${optionIndex}].label`}
                                                  component="div"
                                                  className="text-danger"
                                                />
                                                <div className="flex-grow-1"></div>
                                                <div className="form-text text-muted">
                                                  {option.label.length}/36
                                                </div>
                                              </div>
                                              <div className="col-auto" style={{ visibility: "hidden" }}>
                                                <button type="button" className="btn btn-bg-light">
                                                  <KTIcon iconName={"trash"} className="fs-2" />
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        ))}

                                        {question.options.length < 5 && (
                                          <div className="d-flex justify-content-center mt-5">
                                            <button
                                              type="button"
                                              style={{
                                                borderColor: "grey",
                                                borderWidth: "1px",
                                                borderStyle: "solid",
                                              }}
                                              className="btn light-container"
                                              onClick={() => pushOption(initOptionVal)}
                                            >
                                              Add a new option
                                            </button>
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </FieldArray>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </FieldArray>

                    {/* Send Notification Section */}
                    <div className="mt-6 mb-6">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={sendNotification}
                            onChange={(e) => setSendNotification(e.target.checked)}
                            name="sendNotification"
                            color="primary"
                          />
                        }
                        label={
                          <Typography variant="body1" sx={{ fontWeight: 600, fontSize: "1.075rem" }}>
                            Send Notification
                          </Typography>
                        }
                      />
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 4 }}>
                        Check this to send push notifications to users when the quiz is {id ? "updated" : "published"}.
                      </Typography>
                    </div>
                  </div>
                </div>

                <div
                  className="card-footer position-sticky d-flex justify-content-end py-6 px-1"
                  style={{ marginRight: "20px" }}
                >
                  <CancelButton />
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {!loading && "Save"}
                    {loading && (
                      <span className="indicator-progress" style={{ display: "block" }}>
                        Please wait...{" "}
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default AddQuiz;
