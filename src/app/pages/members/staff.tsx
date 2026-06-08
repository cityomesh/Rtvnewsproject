import * as Yup from 'yup';
import useSWR from "swr";
import client, { fetcher } from "../../modules/service/network.ts";
import { toast } from 'react-toastify';


export interface ISupportStaff {
    age: number,
    name: string,
    city: string,
    height: string,
    position: string,
    socialMediaId: string,
    memberType: string,
    // staffType: string,
    photo: string,
    teamId: string,
    // dob: string,
    
}

export const initSupportStaffVal: ISupportStaff = {
    age: 0,
    name: "",
    city: "",
    height: "",
    position: "",
    socialMediaId: "",
    memberType: "SUPPORT_STAFF",
    // staffType: "",
    photo: "",
    teamId: "",
    // dob: ""
}

export const createSupportStaffSchema = Yup.object().shape({
    age: Yup.number().required().test(
      "is-not-zero",
      "Age cannot be 0",
      (value) => value !== 0
    ).label("Age"),
    name: Yup.string().required().label("Name"),
    city: Yup.string().required().label("City"),
    height: Yup.string().required().label("Height"),
    position: Yup.string().required().label("Position"),
    socialMediaId: Yup.string().required().label("Social Media"),
    // memberType: Yup.string().required().label("Member Type"),
    // staffType: Yup.string().required().label("Staff Type"),
    photo: Yup.string().required().label("Photo"),
    teamId: Yup.string().required().label("Team Id"),
    // dob: Yup.string().required().label("DOB")

});



export async function createOrUpdateSupportStaff({
    values,
    id,
    onSuccess,
    onError,
    onEnd,
  }: {
    values: ISupportStaff;
    id?: string;
    onSuccess: () => void;
    onError: (message: string) => void;
    onEnd?: () => void;
  }) {
    try {
      
      let response;
      if (id) {
        response = await client.patch(`/supportstaff/${id}`, values);
        console.log(values);
      } else {
        response = await client.post("/supportstaff", values);
      }
  
      if (response.status >= 200 && response.status < 300) {
        onSuccess();
        return response.data;
      } else if (response.status === 401 || response.status === 403) {
        toast.error("Please login");
        window.location.reload();
      } else {
        onError("Something went wrong, please try again!");
      }
    } catch (error) {
      console.log("error in saving ",error);
      onError("Something went wrong, please try again!");
    } finally {
      if (onEnd) onEnd();
    }
    return (
      <>
        <div className=''>
          response.map
        </div>
      </>
    );
  }