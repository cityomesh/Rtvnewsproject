/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { PageTitle } from "../../../_metronic/layout/core";
import { useEffect, useState } from "react";
import { IPoll, createPollSchema, initOption, initPoll, maxCharForTextInput } from "./poll";
import { createOrUpdatePoll, usePoll } from "./poll-controller";
import { toast } from "react-toastify";
import { KTIcon } from "../../../_metronic/helpers";
import { useNavigate, useParams } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useStyles } from "../matches/AddMatch";
import dayjs from "dayjs";
import { useThemeMode } from "../../../_metronic/partials/layout/theme-mode/ThemeModeProvider";
import { createTheme, ThemeProvider } from "@mui/material";
import { grey_02 } from "../../common/colors";
import './style.css';
import CancelButton from "../../common/cancelButton";

const AddPoll = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initData, setInitData] = useState<IPoll>(initPoll);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const themeMode = useThemeMode();

  const [systemMode, setSystemMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: any) => setSystemMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const createCalendarTheme = () => {
    if (
      themeMode.mode === "dark" ||
      (themeMode.mode === "system" && systemMode)
    ) {     
      return createTheme({
        components: {
          MuiMenuItem: {
            styleOverrides: {
              root: {
                "&:hover": {
                  backgroundColor: "#1565c0",
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
                color: "white",
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: grey_02,
                color: "white",
              },
            },
          },
          MuiTypography: {
            styleOverrides: {
              caption: {
                color: "white",
              },
            },
          },
          MuiInputBase: {
            styleOverrides: {
              input: {
                color: "#99A1B7",
              },
            },
          },
        },
      });
    }
    
    return createTheme({
      components: {
        MuiInputBase: {
          styleOverrides: {
            input: {
              color: "#99A1B7",
            },
          },
        },
      },
    });
  };

  const datePickerTheme = createCalendarTheme();

  usePoll(id ?? "", (e) => {
    setInitData(e);
  });

  useEffect(() => {
    return () => {
      setInitData(initPoll);
    };
  }, [id]);

  return (
    <>
      {id ? (
        <PageTitle description="" breadcrumbs={[]}>
          Edit Poll
        </PageTitle>
      ) : (
        <PageTitle description="" breadcrumbs={[]}>
          Add Poll
        </PageTitle>
      )}
      <div className="card fullscreen-form-card">
        <div
          className="card-header border-0 cursor-pointer"
          role="button"
          data-bs-toggle="collapse"
          data-bs-target="#kt_account_profile_details"
          aria-expanded="true"
          aria-controls="kt_account_profile_details"
        >
          <div className="card-title m-0">
            <h3 className="fw-bolder m-0">Poll</h3>
          </div>
        </div>

        <div className="collapse show" style={{ flex: 1, overflow: "hidden" }}>
          <Formik
            initialValues={initData}
            validationSchema={createPollSchema}
            validateOnMount={true}
            enableReinitialize={true}
            onSubmit={async (values, actions) => {
              setLoading(true);
              await createOrUpdatePoll({
                values,
                id: id,
                onSuccess: () => {
                  toast.success("Poll saved!");
                  navigate("/polls");
                },
                onError: (e) => toast.error(e),
                onEnd: () => setLoading(false),
              });
            }}
          >
            {(formik) => {
              const optionCount = formik.values.question.options.length;
              return (
                <Form className="d-flex flex-column h-100">
                  <div className="card-body scrollable-form-body">
                    <div className="row mb-6">
                      <label className="col-lg-4 col-form-label required fw-bold fs-6">
                        Question ({formik.values.question.title.length}/{maxCharForTextInput})
                      </label>
                      <div className="col-lg-8 fv-row">
                        <Field
                          type="text"
                          className="form-control form-control-lg form-control-solid"
                          placeholder="Title"
                          maxLength={maxCharForTextInput}
                          {...formik.getFieldProps("question.title")}
                        />
                        {formik.touched.question?.title &&
                          formik.errors.question?.title && (
                            <div className="fv-plugins-message-container">
                              <div className="fv-help-block">
                                {formik.errors.question.title}
                              </div>
                            </div>
                          )}                      
                      </div>
                    </div>

                    {/* Expiry Date */}
                    <div className="row mb-6">
                      <label className="col-lg-4 col-form-label required fw-bold fs-6">
                        Expiry Date
                      </label>
                      <div className="col-lg-8 fv-row">
                        <ThemeProvider theme={datePickerTheme}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DateTimePicker"]}>
                              <DateTimePicker
                                sx={{
                                  p: "10px",
                                  border: "0px",
                                  outline: "none",
                                }}
                                onChange={(date) => {
                                  formik.setFieldValue(
                                    "expiryDate",
                                    date?.toISOString()
                                  );
                                }}
                                value={dayjs(formik.values.expiryDate)}
                                format="DD MMM YYYY hh:mm A"
                                className={`form-control form-control-solid ${
                                  themeMode.mode === "dark" ||
                                  (themeMode.mode === "system" && systemMode)
                                    ? classes.dark
                                    : classes.root
                                }`}
                                slotProps={{
                                  textField: {
                                    placeholder: "Select expiry date and time",
                                    sx: {
                                      '::placeholder': { color: '#6c757d' },
                                    },
                                  },
                                }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </ThemeProvider>

                        {formik.touched.expiryDate &&
                          formik.errors.expiryDate && (
                            <div className="fv-plugins-message-container">
                              <div className="fv-help-block">
                                <ErrorMessage name="expiryDate" />
                              </div>
                            </div>
                          )}                      
                      </div>
                    </div>

                    <FieldArray name="question.options">
                    {({ remove, push }) => (
                      <div className="accordion" id="questionsAccordion">
                        {/* Label + Add Button Row */}
                        {/* <div className="row align-items-center mb-3">
                          <div className="row w-100 d-flex " style={{ background: 'red' }}>
                            <label className="col-lg-4 col-form-label required fw-bold fs-6">
                              Options
                            </label>
                            <div className="col-lg-4">
                              <button
                                disabled={optionCount >= 5}
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => push(initOption)}
                              >
                                Add Option
                              </button>
                            </div>
                          </div>
                            <div className="col-lg-4 fv-plugins-message-container">
                              <div className="fv-help-block">
                                {typeof formik.errors.question?.options !== "object" && (
                                  <ErrorMessage name="question.options" />
                                )}
                              </div>
                            </div>
                          </div> */}

                          <div className="row align-items-center mb-3">
                            <div className="d-flex justify-content-between align-items-center w-100">
                              <label className="col-form-label required fw-bold fs-6 mb-0">
                                Options
                              </label>
                              <button
                                disabled={optionCount >= 5}
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => push(initOption)}
                              >
                                Add Option
                              </button>
                            </div>
                            <div className="fv-plugins-message-container mt-2">
                              <div className="fv-help-block">
                                {typeof formik.errors.question?.options !== "object" && (
                                  <ErrorMessage name="question.options" />
                                )}
                              </div>
                            </div>
                          </div>
                        

                        {/* Option Inputs */}
                        {formik.values.question.options.map((option, index) => (
                          <div key={index} className="row align-items-center mb-3 px-4">
                            <label className="col-lg-4 col-form-label required fw-bold fs-6">
                              Option {index + 1}
                            </label>

                            <div className="col-lg-7 d-flex align-items-center gap-3">
                              {/* <Field
                                type="text"
                                name={`question.options[${index}].label`}
                                className="form-control form-control-lg form-control-solid"
                                placeholder="Enter a label"
                                maxLength={maxCharForTextInput}
                              /> */}

                              <Field
                                type="text"
                                name={`question.options[${index}].label`}
                                className="form-control form-control-lg form-control-solid"
                                placeholder="Enter a label"
                                maxLength={maxCharForTextInput}
                              />
                              <div className="d-flex justify-content-between">
                                <small className="text-muted ms-auto">
                                  {formik.values.question.options[index].label.length}/{maxCharForTextInput}
                                </small>
                              </div>

                              {/* <button
                                type="button"
                                className="btn btn-link text-danger p-0"
                                onClick={() => remove(index)}
                                aria-label={`Delete option ${index + 1}`}
                                style={{ marginLeft: '0.5rem' }}
                              >
                                <KTIcon iconName="trash" className="fs-2" />
                              </button> */}

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

                            <div className="col-12 col-lg-8 offset-lg-4 mt-1">
                              <ErrorMessage
                                name={`question.options[${index}].label`}
                                component="div"
                                className="fv-help-block text-danger"
                              />
                            </div>
                          </div>
                        ))}

                        {optionCount === 5 && (
                          <p className="text-center text-danger mb-3">Maximum 5 Options allowed</p>
                        )}
                      </div>
                    )}
                  </FieldArray>

                  </div>

                  <div className="card-footer d-flex justify-content-end py-6 px-9">
                    <CancelButton />
                    <button type="submit" className="btn btn-primary" disabled={loading || !formik.isValid || Object.keys(formik.errors).length > 0}>
                      {!loading ? "Save" : (
                        <span className="indicator-progress" style={{ display: "block" }}>
                          Please wait...
                          <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                      )}
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default AddPoll;

