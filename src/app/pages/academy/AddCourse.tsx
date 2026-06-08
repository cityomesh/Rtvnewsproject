import { useNavigate, useParams } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import { useEffect, useState } from "react";
import { createCourseSchema, ICourse, initCourseVal } from "./course";
import useSWR from "swr";
import { fetcher } from "../../modules/service/network";
import { useFormik } from "formik";
import { createOrUpdateCourse, useCourse } from "./course-controller";
import { toast } from "react-toastify";


export const AddCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [initData, setInitData] = useState<ICourse>(
    initCourseVal //this sets initial values of team1 and team2 to null, because they haven't been selected by the user yet
  );

  
    useCourse(id ?? "", (e) => {
      if (id) {
        setInitData(e); // Set team data for editing
      } else {
        setInitData(initCourseVal); // Reset to initial values when creating
      }
    });

  const formik = useFormik<ICourse>({
    initialValues: initData,
    validationSchema: createCourseSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      // setLoading(false);
      await createOrUpdateCourse({
        values,
        id,
        onSuccess: () => {
          toast.success("Course saved!");
          navigate("/course");
        },
        onError: (e) => toast.error(e),
        onEnd: () => setLoading(false),
      });
    },
  });

  useEffect(()=> {
    return () => {
      setInitData(initCourseVal)
      }
   },[id])

  return (
    <>
      <PageTitle description="" breadcrumbs={[]}>
        {id ? 'Edit Course' : 'Create Course'}
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
          {/* <div className="card-title m-0">
            <h3 className="fw-bolder m-0">Create Course</h3>
          </div> */}
        </div>
        {/* Venue State */}
        <div id="kt_account_profile_details" className="collapse show">
          <form onSubmit={formik.handleSubmit} noValidate className="form">
            <div className="card-body border-top p-9">
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Course Name
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="E.g., Beginner, Intermediate, Advanced, etc"
                     {...formik.getFieldProps("level")}
                  />
                  

                  {formik.touched.level && formik.errors.level && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formik.errors.level}
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
