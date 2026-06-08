import {PageTitle} from "../../../_metronic/layout/core";
import {KTIcon} from "../../../_metronic/helpers";
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useParams} from "react-router";

import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import {creatTeamSchema, initTeamVal, ITeam} from "./team.tsx";
import {createOrUpdateTeam, useTeam} from "./team-controller.ts";
import {uploadFile} from "../../modules/service/fileservice.tsx";

import useSWR from "swr";
import {fetcher} from "../../modules/service/network.ts";

const AddTeam = () => {
  
  const {id} = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUri, setImageUri] = useState<string>("");
  const [initData, setInitData] = useState<ITeam>(
      initTeamVal
  );

  
  let states: string[] = []
  const {data:countries} = useSWR('https://cdn.slicevista.com/countries.json',fetcher)

  useTeam(id ?? "", (e) => {
    if (id) {
      setInitData(e); // Set team data for editing
    } else {
      setInitData(initTeamVal); // Reset to initial values when creating
    }
  });


  countries?.forEach((country:any)=>{
    if(country.code3 === 'IND'){
      states = country.states
    }
  })

  
  const formik = useFormik<ITeam>({
    initialValues: initData,
    validationSchema: creatTeamSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      await createOrUpdateTeam({
        values, id,
        onSuccess: () => {
          toast.success("Team saved!");
          navigate("/team");
        },
        onError: (e) => toast.error(e),
        onEnd: () => setLoading(false)
      })
    }
  });

  const uploadBannerImage = async (e: any) => {
    const file = e.target.files[0];
    setImageUri(URL.createObjectURL(file));

    setIsUploadingImage(true);
    await uploadFile({
      file, type: "MEDIA_IMAGES",
      onSuccess: (e) => {
        formik.setFieldValue("teamLogo", e.url);
        toast.success("Image uploaded successfully!");
      },
      onError: (code, message) => {
        if (!message) message = "Something went wrong!"
        toast.error(message);
      }
    });
    setIsUploadingImage(false);
  };

  useEffect(()=> {
    return () => {
      setInitData(initTeamVal)
    }
   },[id])

  return (
      <>
        <PageTitle description='' breadcrumbs={[]}>
        {id ? "Edit Team" : "Create Team"}
        </PageTitle>
        <div className="card mb-5 mb-xl-10">
          

          <div id="kt_account_profile_details" className="collapse show">
            <form onSubmit={formik.handleSubmit} noValidate className="form">
              <div className="card-body border-top p-9">

                <div className="row mb-6">
                  <label className="col-lg-4 col-form-label required fw-bold fs-6">
                    
                    Team name ({formik.values.teamName ? formik.values.teamName?.length : 0}/30)
                  </label>

                  <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Name"
                        maxLength={30}
                        {...formik.getFieldProps("teamName")}
                    />

                    {formik.touched.teamName && formik.errors.teamName && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">{formik.errors.teamName}</div>
                        </div>
                    )}
                  </div>
                </div>

                <div className="row mb-6">
                  <label className="col-lg-4 col-form-label required fw-bold fs-6">
                    Team State
                  </label>

                  <div className="col-lg-8 fv-row">
                    <select
                        className="form-select form-select-solid form-select-lg fw-bold"
                        id='states'
                        {...formik.getFieldProps("teamState")}
                        
                    >
                      <option value="">Select Team State</option>
                      {
                        states?.map((state:any) => (
                            <option value={state.name}>{state.name}</option>
                        ))
                      }
                    </select>

                    {formik.touched.teamState && formik.errors.teamState && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">{formik.errors.teamState}</div>
                        </div>
                    )}
                  </div>
                </div>

                <div className="row mb-6">
                  <label className="col-lg-4 col-form-label required fw-bold fs-6">
                    {/* Background Theme Color ({formik.values.teamThemeColor?.length}/30) */}
                    Background Theme Color ({formik.values.teamThemeColor ? formik.values.teamThemeColor?.length : 0}/30)
                  </label>

                  <div className="col-lg-8 fv-row">
                    <input
                        type="color"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Color"
                        {...formik.getFieldProps("teamThemeColor")}
                    />

                    {formik.touched.teamThemeColor && formik.errors.teamThemeColor && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">{formik.errors.teamThemeColor}</div>
                        </div>
                    )}
                  </div>
                </div>

                <div className="row mb-6">
                  <label className="col-lg-4 col-form-label required fw-bold fs-6">
                    Upload Logo
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
                      Uploading Logo{" "}
                            <span
                                className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                      ) : "Select Logo"}
                    </label>

                    <input
                        id="file-upload"
                        type="file"
                        onChange={uploadBannerImage}
                        accept="image/*"
                        disabled={isUploadingImage}
                        style={{display: "none"}}
                    />

                    {formik.touched.teamLogo && formik.errors.teamLogo && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.teamLogo}
                          </div>
                        </div>
                    )}

                    {imageUri && (
                        <div>
                          <br/>
                          <div className="symbol symbol-200px me-5 col-lg-8 fv-row">
                            <img src={imageUri} alt="preview of banner image"/>
                          </div>
                        </div>
                    )}

                    {id && !imageUri && (
                        <div>
                          <br/>
                          <div className="symbol symbol-200px me-5 col-lg-8 fv-row">
                            <img
                                src={formik.values.teamLogo}
                                alt="preview of banner image"
                            />
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
                    {!loading && "Save"}
                    {loading && (
                        <span
                            className="indicator-progress"
                            style={{display: "block"}}
                        >
                      Please wait...{" "}
                          <span
                              className="spinner-border spinner-border-sm align-middle ms-2"></span>
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

export {AddTeam};



