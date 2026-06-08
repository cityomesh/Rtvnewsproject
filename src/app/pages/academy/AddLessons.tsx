import { useNavigate, useParams } from "react-router-dom";
import { createLessonSchema, ILesson, initLessonVal } from "./lesson";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../modules/service/network";
import { useFormik } from "formik";
import { createOrUpdateLesson } from "./lesson-controller";
import { toast } from "react-toastify";
import { PageTitle } from "../../../_metronic/layout/core";
import { RiRadioButtonFill } from "react-icons/ri";
import { IoIosRadioButtonOff } from "react-icons/io";
import { CourseData } from "./AllAcademy";
import ReactQuill from "react-quill";
import { KTIcon } from "../../../_metronic/helpers";
import { uploadVideoAndThumbnail } from "../../modules/service/fileservice";



export const AddLesson = () => {
  const { id } = useParams();
  const [initData, setInitData] = useState<ILesson>(
    initLessonVal 
  );
  const [loading, setLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>();
  const navigate = useNavigate();

  const {data: courseList, error: courseListError, isLoading: courseIsLoading} = useSWR('/course', fetcher);
  const {data: quizList, error: quizListError, isLoading: quizIsLoading} = useSWR('/quiz', fetcher);
  if(id){
    const { data, error, isLoading } = useSWR(`/lessonModels/${id}`, fetcher, {
        onSuccess: (data, key, config) => {
        console.log({ data }); //this always prints "undefined"
        setInitData(data);
        },
    });
  }

  const formik = useFormik<ILesson>({
    initialValues: initData,
    validationSchema: createLessonSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      // setLoading(false);
      await createOrUpdateLesson({
        values,
        id,
        onSuccess: () => {
          toast.success("Lesson saved!");
          navigate("/course");
        },
        onError: (e) => toast.error(e),
        onEnd: () => setLoading(false),
      });
    },
  });

  
  
  const uploadVideo = async (e: any) => {
    const file = e.target.files[0];
    setIsUploadingImage(true);
    await uploadVideoAndThumbnail({
      file, videoPath: "MEDIA_VIDEOS", thumbnailPath: "MEDIA_IMAGES",
      onSuccess: (e: any) => {
        formik.setFieldValue("videoFile", file);
        formik.setFieldValue("videoUrl", e.video.url);
        formik.setFieldValue("thumbnailUrl", e.thumbnail.url);
        toast.success("Video uploaded successfully!");
      },
      onError: (code, message) => {
        if (!message) message = "Something went wrong!"
        toast.error(message);
      }
    });
    setIsUploadingImage(false);
  };
  

  return (
    <>
      <PageTitle description="" breadcrumbs={[]}>
        Add Lesson
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
            <h3 className="fw-bolder m-0">Create Lesson</h3>
          </div>
        </div>
        {/* Venue State */}
        <div id="kt_account_profile_details" className="collapse show">
          <form onSubmit={formik.handleSubmit} noValidate className="form">
            <div className="card-body border-top p-9">
                <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Course
                </label>
                <div className="col-lg-8 fv-row">
                <select
                      className="form-select form-select-solid form-select-lg fw-bold"
                      value={
                        formik.values.courseId
                      }
                      onChange={(evt) => {
                        if(evt.target.value)
                            formik.setFieldValue('courseId', evt.target.value)
                            const c = courseList?._embedded.course.find((t: CourseData) => t.id==evt.target.value)
                            formik.setFieldValue('level', c.level)
                      }}
                  >
                    <option value="">Select Course</option>
                    {courseList && courseList?._embedded.course.map((t: CourseData) => (
                      <option key={t.id} value={t.id}>
                        {t.level}
                      </option>
                    ))}
                  </select>
                  </div>

                  {formik.touched.courseId && formik.errors.courseId && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">{formik.errors.courseId}</div>
                    </div>
                  )}
                </div>
                <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">
                  Quiz
                </label>
                <div className="col-lg-8 fv-row">
                <select
                      className="form-select form-select-solid form-select-lg fw-bold"
                      value={
                        formik.values.quizId
                      }
                      onChange={(evt) => {
                        if(evt.target.value)
                            formik.setFieldValue('quizId', evt.target.value)
                      }}
                  >
                    <option value="">Select Quiz</option>
                    {quizList && quizList?._embedded.quiz.map((t: any) => (
                      <option key={t.id} value={t.id}>
                        {t.questions.length>0 ? t.questions[0].question : t.id}
                      </option>
                    ))}
                  </select>
                  </div>

                  {formik.touched.quizId && formik.errors.quizId && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">{formik.errors.quizId}</div>
                    </div>
                  )}
                </div>
                <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Title
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="title"
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
              <label className="col-lg-4 col-form-label required fw-bold fs-6">
                    Upload Video
                  </label>

                  <div className="col-lg-8 fv-row">
                    <label
                        htmlFor="file-upload"
                        className="btn btn-sm btn-light-primary w-50 fs-6 p-5"
                    >
                      <KTIcon iconName="file-up" className="fs-2"/>
                      {isUploadingImage ? (
                          <span
                              className="indicator-progress"
                              style={{display: "block"}}
                          >
                      Uploading Video{" "}
                            <span
                                className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                      ) : "Select Video"}
                    </label>

                    <input
                        id="file-upload"
                        type="file"
                        onChange={uploadVideo}
                        accept="video/*"
                        disabled={isUploadingImage}
                        style={{display: "none"}}
                    />

                    {formik.touched.videoUrl && formik.errors.videoUrl && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.videoUrl}
                          </div>
                        </div>
                    )}

                    {formik.touched.videoFile && formik.errors.videoFile && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.videoFile}
                          </div>
                        </div>
                    )}

                    {formik.values.thumbnailUrl!=="" && (
                        <div>
                          <br/>
                          <div className="symbol symbol-200px me-5 col-lg-8 fv-row">
                            <img
                                src={formik.values.thumbnailUrl}
                                alt="preview of banner image"
                            />
                          </div>
                        </div>
                    )}
                  </div>
              </div>
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Description
                </label>

                <div className="col-lg-8 fv-row">
                    <ReactQuill
                    theme="snow"
                    value={formik.values.description}
                    onChange={(value) => formik.setFieldValue("description", value)}
                    placeholder="Content"
                    className="form-control form-control-lg form-control-solid"
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
          </form>
        </div>
      </div>
    </>
  );
};
