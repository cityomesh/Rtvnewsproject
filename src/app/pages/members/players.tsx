import * as Yup from 'yup';
import client from '../../modules/service/network';
import { toast } from 'react-toastify';

export interface IPlayer {
    age: number,
    name: string,
    city: string,
    height: string,
    position: string,
    socialMediaId: string,
    jerseyNumber: number,
    totalMatches: number,
    photo: string,
    designation: string,
    dob: string,
    country: string
    memberType: string,
    teamId: string
}

export const initplayerVal: IPlayer = {
    age: 0,
    name: "",
    city: "",
    height: "",
    position: "",
    socialMediaId: "",
    jerseyNumber: 0,
    totalMatches: 0,
    photo: "",
    designation: "",
    dob: "",
    country: "",
    memberType: "PLAYER",
    teamId: ""
}

export const createPlayerSchema = Yup.object().shape({
    age: Yup.number().required().label("Age"),
    name: Yup.string().required().label("Name"),
    city: Yup.string().required().label("City"),
    height: Yup.string().required().label("Height"),
    position: Yup.string().required().label("Position"),
    socialMediaId: Yup.string().required().label("Social Media"),
    jerseyNumber: Yup.number().required().test(
      "is-not-zero",
      "Jersey Number cannot be 0",
      (value) => value !== 0
    ).label("Jersey Number"),
    totalMatches: Yup.number().required().label("Total Matches"),
    designation: Yup.string().required().label("Designation"),
    dob: Yup.string().required().label("Dob"),
    country: Yup.string().required().label("Country"),
    teamId: Yup.string().required().label("Team Id")
    // memberType: Yup.string()
})


export async function createOrUpdatePlayer({
    values,
    id,
    onSuccess,
    onError,
    onEnd,
  }: {
    values: IPlayer;
    id?: string;
    onSuccess: () => void;
    onError: (message: string) => void;
    onEnd?: () => void;
  }) {
    try {
      
      let response;
      if (id) {
        response = await client.patch(`/player/${id}`, values);
      } else {
        response = await client.post("/player", values);
        
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
  