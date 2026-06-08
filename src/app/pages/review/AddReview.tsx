import { PageTitle } from "../../../_metronic/layout/core";
import { KTIcon } from "../../../_metronic/helpers";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import ReactQuill from "react-quill";
import useSWR from "swr";
import { fetcher } from "../../modules/service/network";

import {createOrUpdateReview} from "./review-controller.ts"


import {
  Formik,
  ErrorMessage,
  Form,
  
} from "formik";
import {
  IReview,
  initReviewVal,
  createReviewSchema,
} from "./review.tsx";



const AddReview = () => {
  const { id } = useParams();
  const [initData, setInitData] = useState<IReview>(initReviewVal);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  
  const navigate = useNavigate();

  if(id){
    const { data, error, isLoading } = useSWR(`/training/videos/${id}`, fetcher, {
        onSuccess: (data, key, config) => {
        setInitData(data);
        },
    });
  }

 
  return (
    <>
      <PageTitle description="" breadcrumbs={[]}>
        Add Review
      </PageTitle>
      
      <div className="card mb-5 mb-xl-10">

        <div id="kt_account_profile_details" className="collapse show">

          <Formik
            initialValues={initData}
            validationSchema={createReviewSchema}
            enableReinitialize={true}
            onSubmit={async (values) => {
              
              setLoading(true);
              await createOrUpdateReview({
                values,
                id,
                onSuccess: () => {
                  toast.success("Review saved!");
                  navigate("/review")
                },
                onError: (e) => toast.error(e),
                onEnd: () => setLoading(false),
              });
            

            }}
          >
            {(formik) => {
              
              return <Form>
              <div className="card-body border-top p-9">
                {/* Review Title */}
                <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Title
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     readOnly
                     className="form-control form-control-lg form-control-solid"
                     placeholder="title"
                     {...formik.getFieldProps("title")}
                  />
                  

                  
                </div>
              </div>
                
                

                {/* Comment a Review */}
                <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Review
                </label>

                <div className="col-lg-8 fv-row">
                    <ReactQuill
                    theme="snow"
                    // value={formik.values.reviewComment}
                    onChange={(value) => formik.setFieldValue("reviewComment", value)}
                    placeholder="Content"
                    className="form-control form-control-lg form-control-solid"
                    />
                  

                  {formik.touched.reviewComment && formik.errors.reviewComment && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formik.errors.reviewComment}
                        </div>
                      </div>
                  )}
                </div>
              </div>


                {/* Rating */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Rating
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="number"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Give Rating out of 10"
                     {...formik.getFieldProps("trainingRating")}
                  />
                  

                  {formik.touched.trainingRating && formik.errors.trainingRating && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.trainingRating}
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
            </Form>
            }
            }
          </Formik>
          {/* </form> */}
        </div>
      </div>
    </>
  );
};

export default AddReview;
