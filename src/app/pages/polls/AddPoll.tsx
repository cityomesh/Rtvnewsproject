
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { PageTitle } from "../../../_metronic/layout/core";
import { useEffect, useState } from "react";
import { IPoll, createPollSchema, initOption, initPoll, maxCharForTextInput } from "./poll";
import { createOrUpdatePoll, usePoll } from "./poll-controller";
import { toast } from "react-toastify";
import { KTIcon } from "../../../_metronic/helpers";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
import { getCurrentUser } from "../../modules/auth/session.ts";

const DRAFTS_STORAGE_KEY = "poll_drafts";

const AddPoll = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const draftId = queryParams.get("draftId");

  const [initData, setInitData] = useState<IPoll>(initPoll);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const themeMode = useThemeMode();
  const [sendNotification, setSendNotification] = useState(false);
  const [systemMode, setSystemMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [isDraftMode, setIsDraftMode] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);

  // ========== Load API poll if id exists ==========
  const { quiz: apiPoll, isLoading: apiLoading } = usePoll(id ?? "", () => {});
  useEffect(() => {
    if (id && apiPoll) {
      setInitData(apiPoll);
      setIsDraftMode(false);
      setCurrentDraftId(null);
    }
  }, [id, apiPoll]);

  // ========== Load draft if draftId exists ==========
  useEffect(() => {
    if (!id && draftId) {
      const stored = localStorage.getItem(DRAFTS_STORAGE_KEY);
      if (stored) {
        const drafts: any[] = JSON.parse(stored);
        const draft = drafts.find((d) => d.id === draftId);
        if (draft) {
          setInitData(draft);
          setIsDraftMode(true);
          setCurrentDraftId(draft.id);
        } else {
          setInitData(initPoll);
          setIsDraftMode(false);
          setCurrentDraftId(null);
        }
      }
    } else if (!id && !draftId) {
      setInitData(initPoll);
      setIsDraftMode(false);
      setCurrentDraftId(null);
    }
  }, [id, draftId]);

  // ========== Save draft to localStorage ==========
  const savePollDraftLocally = (values: IPoll) => {
    try {
      let existingDrafts = localStorage.getItem(DRAFTS_STORAGE_KEY);
      let drafts: any[] = existingDrafts ? JSON.parse(existingDrafts) : [];

      if (currentDraftId) {
        const index = drafts.findIndex((d) => d.id === currentDraftId);
        if (index !== -1) {
          drafts[index] = {
            ...drafts[index],
            ...values,
            updatedAt: new Date().toISOString(),
          };
          toast.success("Draft updated successfully!");
        } else {
          setCurrentDraftId(null);
        }
      }

      if (!currentDraftId) {
        const newDraftId = `poll_draft_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const newDraft = {
          id: newDraftId,
          ...values,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        drafts.push(newDraft);
        toast.success("Draft saved locally!");
        setCurrentDraftId(newDraftId);
      }

      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
      navigate("/poll/drafts");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save poll draft.");
    }
  };

  // ========== Publish poll (API call) and delete draft if any ==========
  const publishPoll = async (values: IPoll, draftIdToDelete?: string | null) => {
    setLoading(true);
    await createOrUpdatePoll({
      values,
      id: id,
      notify: sendNotification,
      onSuccess: (responseData?: any) => {
        toast.success("Poll saved!");
        const currentUser = getCurrentUser();
        const creator = currentUser?.username || 'unknown';
        let pollId = id;
        if (!id && responseData?.id) {
          pollId = responseData.id;
        }
        if (pollId) {
          const existing = localStorage.getItem('poll_creators');
          const creators = existing ? JSON.parse(existing) : {};
          creators[pollId] = creator;
          localStorage.setItem('poll_creators', JSON.stringify(creators));
          console.log(`Stored poll creator: ${pollId} -> ${creator}`);
        }
        // If this was a draft, delete the draft from localStorage
        if (draftIdToDelete) {
          const stored = localStorage.getItem(DRAFTS_STORAGE_KEY);
          if (stored) {
            const drafts = JSON.parse(stored);
            const updated = drafts.filter((d: any) => d.id !== draftIdToDelete);
            localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updated));
          }
        }
        navigate("/polls");
      },
      onError: (e) => toast.error(e),
      onEnd: () => setLoading(false),
    });
  };

  // Theme and calendar setup (unchanged)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: any) => setSystemMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const createCalendarTheme = () => {
    if (themeMode.mode === "dark" || (themeMode.mode === "system" && systemMode)) {     
      return createTheme({
        components: {
          MuiMenuItem: { styleOverrides: { root: { "&:hover": { backgroundColor: "#1565c0" } } } },
          //@ts-ignore
          MuiPickersDay: { styleOverrides: { root: { color: 'white', '&:hover': { backgroundColor: '#1565c0' } } } },
          MuiSvgIcon: { styleOverrides: { root: { color: "white" } } },
          MuiIconButton: { styleOverrides: { root: { "&:hover": { backgroundColor: "#1565c0" } } } },
          MuiPaper: { styleOverrides: { root: { backgroundColor: grey_02, color: "white" } } },
          MuiTypography: { styleOverrides: { caption: { color: "white" } } },
          MuiInputBase: { styleOverrides: { input: { color: "#99A1B7" } } },
        },
      });
    }
    return createTheme({
      components: {
        MuiInputBase: { styleOverrides: { input: { color: "#99A1B7" } } },
      },
    });
  };

  const datePickerTheme = createCalendarTheme();

  // Cleanup on unmount
  useEffect(() => {
    return () => { setInitData(initPoll); };
  }, [id]);

  return (
    <>
      <PageTitle description="" breadcrumbs={[]}>
        {id ? "Edit Poll" : isDraftMode ? "Edit Poll Draft" : "Add Poll"}
      </PageTitle>
      <div className="card fullscreen-form-card">
        <div className="card-header border-0 cursor-pointer" role="button" data-bs-toggle="collapse" data-bs-target="#kt_account_profile_details" aria-expanded="true" aria-controls="kt_account_profile_details">
          <div className="card-title m-0">
            <h3 className="fw-bolder m-0">
              {id ? "Edit Poll" : isDraftMode ? "Edit Poll Draft" : "Create Poll"}
            </h3>
          </div>
        </div>

        <div className="collapse show" style={{ flex: 1, overflow: "hidden" }}>
          <Formik
            initialValues={initData}
            validationSchema={createPollSchema}
            validateOnMount={true}
            enableReinitialize={true}
            onSubmit={(values) => {
              if (isDraftMode && currentDraftId) {
                publishPoll(values, currentDraftId);
              } else if (id) {
                publishPoll(values, null);
              } else {
                publishPoll(values, null);
              }
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
                        {formik.touched.question?.title && formik.errors.question?.title && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">{formik.errors.question.title}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expiry Date */}
                    <div className="row mb-6">
                      <label className="col-lg-4 col-form-label required fw-bold fs-6">Expiry Date</label>
                      <div className="col-lg-8 fv-row">
                        <ThemeProvider theme={datePickerTheme}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DateTimePicker"]}>
                              <DateTimePicker
                                sx={{ p: "10px", border: "0px", outline: "none" }}
                                onChange={(date) => { formik.setFieldValue("expiryDate", date?.toISOString()); }}
                                value={dayjs(formik.values.expiryDate)}
                                format="DD MMM YYYY hh:mm A"
                                className={`form-control form-control-solid ${themeMode.mode === "dark" || (themeMode.mode === "system" && systemMode) ? classes.dark : classes.root}`}
                                slotProps={{
                                  textField: { placeholder: "Select expiry date and time", sx: { '::placeholder': { color: '#6c757d' } } }
                                }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </ThemeProvider>
                        {formik.touched.expiryDate && formik.errors.expiryDate && (
                          <div className="fv-plugins-message-container"><div className="fv-help-block"><ErrorMessage name="expiryDate" /></div></div>
                        )}
                      </div>
                    </div>

                    <FieldArray name="question.options">
                      {({ remove, push }) => (
                        <div className="accordion" id="questionsAccordion">
                          <div className="row align-items-center mb-3">
                            <div className="d-flex justify-content-between align-items-center w-100">
                              <label className="col-form-label required fw-bold fs-6 mb-0">Options</label>
                              <button disabled={optionCount >= 5} type="button" className="btn btn-secondary" onClick={() => push(initOption)}>Add Option</button>
                            </div>
                            <div className="fv-plugins-message-container mt-2">
                              <div className="fv-help-block">
                                {typeof formik.errors.question?.options !== "object" && <ErrorMessage name="question.options" />}
                              </div>
                            </div>
                          </div>

                          {formik.values.question.options.map((option, index) => (
                            <div key={index} className="row align-items-center mb-3 px-4">
                              <label className="col-lg-4 col-form-label required fw-bold fs-6">Option {index + 1}</label>
                              <div className="col-lg-7 d-flex align-items-center gap-3">
                                <Field
                                  type="text"
                                  name={`question.options[${index}].label`}
                                  className="form-control form-control-lg form-control-solid"
                                  placeholder="Enter a label"
                                  maxLength={maxCharForTextInput}
                                />
                                <div className="d-flex justify-content-between">
                                  <small className="text-muted ms-auto">{formik.values.question.options[index].label.length}/{maxCharForTextInput}</small>
                                </div>
                                <button type="button" className="btn" onClick={() => remove(index)}>
                                  <KTIcon iconName={"trash"} className="text-danger fs-2" />
                                </button>
                              </div>
                              <div className="col-12 col-lg-8 offset-lg-4 mt-1">
                                <ErrorMessage name={`question.options[${index}].label`} component="div" className="fv-help-block text-danger" />
                              </div>
                            </div>
                          ))}
                          {optionCount === 5 && <p className="text-center text-danger mb-3">Maximum 5 Options allowed</p>}
                        </div>
                      )}
                    </FieldArray>

                    {/* Send Notification Checkbox */}
                    <div className="row mb-6">
                      <div className="col-lg-4"></div>
                      <div className="col-lg-8">
                        <label className="d-flex align-items-center gap-2">
                          <input type="checkbox" checked={sendNotification} onChange={(e) => setSendNotification(e.target.checked)} disabled={!!id} />
                          <span className="fw-bold">Send Notifications</span>
                        </label>
                        <small className="text-muted d-block">Check this to send push notifications to users when the poll is {id ? "updated" : "published"}.</small>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer d-flex justify-content-end py-6 px-9">
                    <CancelButton />
                    {!id && (
                      <button type="button" className="btn btn-secondary me-3" disabled={loading} onClick={() => savePollDraftLocally(formik.values)}>
                        Save Draft
                      </button>
                    )}
                    <button type="submit" className="btn btn-primary" disabled={loading || !formik.isValid || Object.keys(formik.errors).length > 0}>
                      {!loading ? (id ? "Update" : isDraftMode ? "Publish" : "Save") : (
                        <span className="indicator-progress" style={{ display: "block" }}>Please wait...<span className="spinner-border spinner-border-sm align-middle ms-2"></span></span>
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
