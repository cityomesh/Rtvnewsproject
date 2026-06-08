import { PageTitle } from "../../../_metronic/layout/core";
import { KTIcon } from "../../../_metronic/helpers";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import ReactQuill from "react-quill";
import useSWR from "swr";
import { fetcher } from "../../modules/service/network";

// import {createOrUpdatePlayer} from "./players.tsx"


import {
  Formik,
  ErrorMessage,
  Form,
  
} from "formik";
import {
//   IReview,
//   initReviewVal,
//   createReviewSchema,
IPlayer,
initplayerVal,
createPlayerSchema,
createOrUpdatePlayer
} from "./players.tsx";





const AddPlayer = () => {
  const { id } = useParams();
  const [initData, setInitData] = useState<IPlayer>(initplayerVal);
  const [dataSend, setDataSend] = useState<IPlayer>(initplayerVal)
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUri, setImageUri] = useState<string>("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const {data:countries} = useSWR('https://cdn.slicevista.com/countries.json',fetcher)
  let states: object[] = []
  countries?.forEach((country:any)=>{
    if(country.code3 === 'IND'){
      states = country.states
    }
  })
  
  const navigate = useNavigate();

  if(id){
    const { data, error, isLoading } = useSWR(`/members/${id}`, fetcher, {
        onSuccess: (data, key, config) => {
        {console.log("see what comes here", data );} //this always prints "undefined"
        setInitData(data);
        },
    });
  }

  // const uploadBannerImage = (e: any) => {
  //   const file = e.target.files[0];
  //   setImageUpload(file);
  //   setImageUri(URL.createObjectURL(file));
  
  //   setLoading(true);
  //   const upload = async () => {
  //     try {
  //       const fileUrl = await fileService(file, "MEDIA_IMAGES");
  //       console.log(fileUrl);
  
  //       if (fileUrl) {
  //         formik.setValues({
  //           ...formik.values,
  //           bannerImage: fileUrl,
  //         });
  //         toast.success("Image uploaded successfully!");
  //       }
  //     } catch (e) {
  //       toast.error("Error uploading image");
  //       console.error("Error occurred while uploading image:", e);
  //     } finally {
  //       setLoading(false);
  //       setImageUpload(null);
  //     }
  //   };
  //   upload();
  // };

 
  return (
    <>
      <PageTitle description="" breadcrumbs={[]}>
        Add Player Details
      </PageTitle>
      
      <div className="card mb-5 mb-xl-10">

        <div id="kt_account_profile_details" className="collapse show">

          <Formik
            initialValues={initData}
            validationSchema={createPlayerSchema}
            enableReinitialize={true}
            onSubmit={async (values) => {
              console.log("values in submit", values)
              const dataToSend = {
                ...values,
                memberType: "SUPPORT_STAFF", // Always send this hardcoded value
              };
              console.log("values in submit", dataToSend)
              setLoading(true);
              await createOrUpdatePlayer({
                values: dataToSend,
                id,
                onSuccess: () => {
                  console.log("values in submit", values)
                  toast.success("Player Detail saved!");
                  navigate("/")
                },
                onError: (e) => toast.error(e),
                onEnd: () => setLoading(false),
              });
            

            }}
          >
            {(formik) => {
              console.log(formik)
              return <Form>
              <div className="card-body border-top p-9">

              {/* Video Thumbnail */}
              {/* <div className="row mb-6">
              <label className="col-lg-4 col-form-label required fw-bold fs-6">
                    Video
                  </label>

                  <div className="col-lg-8 fv-row">
                    

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
              </div> */}
                

                {/* Player Name */}
                <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Name
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Enter Player Name"
                     {...formik.getFieldProps("name")}
                  />
                  
                    {/* {formik.touched.name && formik.errors.name && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.name}
                          </div>
                        </div>
                    )} */}
                  
                </div>
              </div>

              {/* Player Postion in Field */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Position 1
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Position of a Player"
                     {...formik.getFieldProps("position")}
                  />
                  
                    {/* {formik.touched.position && formik.errors.position && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.position}
                          </div>
                        </div>
                    )} */}
                  
                </div>
              </div>

              {/* Player Social Media Id */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Social Media Id
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Enter Player Social Media Id"
                     {...formik.getFieldProps("socialMediaId")}
                  />
                  {/* {formik.touched.socialMediaId && formik.errors.socialMediaId && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.socialMediaId}
                          </div>
                        </div>
                    )} */}

                  
                </div>
              </div>

              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Member Type
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                    //  placeholder="Enter Player Name"
                    // name="memberType",
                    readOnly
                     {...formik.getFieldProps("memberType")}
                  />
                  
                    {/* {formik.touched.name && formik.errors.name && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.name}
                          </div>
                        </div>
                    )} */}
                  
                </div>
              </div>

              {/* Player Height */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Height
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Enter Player Height"
                     {...formik.getFieldProps("height")}
                  />
                  
                    {/* {formik.touched.height && formik.errors.height && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.height}
                          </div>
                        </div>
                    )} */}
                  
                </div>
              </div>

              {/* Player Designation */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Designation
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Enter Player Designation"
                     {...formik.getFieldProps("designation")}
                  />
                  {/* {formik.touched.designation && formik.errors.designation && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.designation}
                          </div>
                        </div>
                    )} */}

                  
                </div>
              </div>

              {/* Player Age */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Age
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="number"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Enter Player Age"
                     {...formik.getFieldProps("age")}
                  />
                  
                    {/* {formik.touched.age && formik.errors.age && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.age}
                          </div>
                        </div>
                    )} */}
                  
                </div>
              </div>

              {/* Player Jersey Number */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Jersey Number
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="number"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Enter player Jersey Number"
                     {...formik.getFieldProps("jerseyNumber")}
                  />
                  {/* {formik.touched.jerseyNumber && formik.errors.jerseyNumber && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.jerseyNumber}
                          </div>
                        </div>
                    )} */}

                  
                </div>
              </div>

              {/* Total Matches played */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Total Matches
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="number"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Enter Total Matches"
                     {...formik.getFieldProps("totalMatches")}
                  />
                  
                    {/* {formik.touched.totalMatches && formik.errors.totalMatches && (
                        <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                            {formik.errors.totalMatches}
                        </div>
                        </div>
                    )} */}
                  
                </div>
              </div>

                {/* Date of Birth */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Date of Birth
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="date"
                     className="form-control form-control-lg form-control-solid"
                     placeholder=""
                     onChange={(e) => {
                      // Manually set the date value using setFieldValue
                      {formik.setFieldValue('date', e.target.value)};
                    }}
                    
                    //  {...formik.getFieldProps("dob")}
                  />
                  

                  {/* {formik.touched.trainingRating && formik.errors.trainingRating && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.trainingRating}
                          </div>
                        </div>
                    )} */}
                </div>
              </div>

              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  City
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Enter Player City Name"
                     {...formik.getFieldProps("city")}
                  />
                  

                  {/* {formik.touched.trainingRating && formik.errors.trainingRating && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.trainingRating}
                          </div>
                        </div>
                    )} */}
                </div>
              </div>

              <div className="row mb-6">
                <label className="col-lg-4 col-form-label required fw-bold fs-6">
                  Country
                </label>

                <div className="col-lg-8 fv-row">
                  <input
                     type="text"
                     className="form-control form-control-lg form-control-solid"
                     placeholder="Enter Player Country Name"
                     {...formik.getFieldProps("country")}
                  />
                  

                  {/* {formik.touched.trainingRating && formik.errors.trainingRating && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.trainingRating}
                          </div>
                        </div>
                    )} */}
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

export default AddPlayer;
