import React, {useEffect, useState} from "react";
import {formDetailsSchema, formInitValues, IFormDetails,} from "../updates/FormModel";
import {useFormik} from "formik";
import client from "../../modules/service/network";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useParams} from "react-router";
import {useNavigate} from 'react-router-dom';

const FormDetails: React.FC = () => {
  const {id} = useParams();
  const [initData,setInitData] = useState<IFormDetails>(formInitValues);
  const maxCharsTitle = 30;
  const maxCharsDesc = 300;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id === undefined || id === '') {
      setLoading(false);
      setInitData(formInitValues);
    } else {
      client
      .get(`update/${id}`)
      .then((response) => {
        setLoading(false);
        setInitData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    }
  }, [id]);

  const formik = useFormik<IFormDetails>({
    initialValues: initData,
    validationSchema: formDetailsSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        let response;
        if (id) {
          response = await client.patch(
              `/update/${id}`,
              values,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
          );
        } else {
          response = await client.post(
              "/update",
              values
          );
        }

        if (response.status >= 200 && response.status < 300) {
          toast.success("Updated successfully!");
          navigate('/updates');
        } else if (response.status === 401 || response.status === 403) {
          toast.error("Please login");
          window.location.reload();
        } else {
          toast.error("Update failed!");
        }
      } catch (error) {
        console.log(error);
        toast.error("Update failed!");
      } finally {
        setLoading(false);
      }
    },    
  });

  return (
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
            <h3 className="fw-bolder m-0">Create Updates</h3>
          </div>
        </div>

        <div id="kt_account_profile_details" className="collapse show">
          <form onSubmit={formik.handleSubmit} noValidate className="form">
            <div className="card-body border-top p-9">
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Title ({formik.values.title.length}/{maxCharsTitle})
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                      type="text"
                      className="form-control form-control-lg form-control-solid"
                      placeholder="Title"
                      maxLength={30}
                      {...formik.getFieldProps("title")}
                  />

                  {formik.touched.title && formik.errors.title && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">{formik.errors.title}</div>
                      </div>
                  )}
                </div>
              </div>

              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Description ({formik.values.description.length}/{maxCharsDesc})
                </label>

                <div className="col-lg-8 fv-row">
                <textarea
                    rows={3}
                    placeholder="Description"
                    className="form-control form-control-lg form-control-solid"
                    {...formik.getFieldProps("description")}
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

              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Category
                </label>
                <div className="col-lg-8 fv-row">
                  <select
                      className="form-select form-select-lg form-select-solid"
                      {...formik.getFieldProps("category")}
                  >
                    <option>Select a category</option>
                    <option value="MATCHES">Matches</option>
                    <option value="TEAM">Team</option>
                    <option value="I_LEAGUE">I-League</option>
                    <option value="OTHERS">Others</option>
                  </select>
                  {formik.touched.category && formik.errors.category && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formik.errors.category}
                        </div>
                      </div>
                  )}
                </div>
              </div>

              <div className="card-footer d-flex justify-content-end py-6 px-1">
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                  {!loading &&  "Save"}
                  {loading && (
                      <span
                          className="indicator-progress"
                          style={{display: "block"}}
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
  );
};

export {FormDetails};
