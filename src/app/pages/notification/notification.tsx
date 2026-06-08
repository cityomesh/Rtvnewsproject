import * as Yup from 'yup';
import client from '../../modules/service/network';
import { toast } from 'react-toastify';

export interface INotifications {
    title: string,
    description: string,
    imageUrl: string,
    path: string
}

export const initNotificationsVal: INotifications = {
    title: "",
    description: "",
    imageUrl: "",
    path: ""
}

export const createNotificationsSchema = Yup.object().shape({
    title: Yup.string().required().label("Title"),
    description: Yup.string().label("Description"),
    imageUrl: Yup.string().label("Image Url"),
    path: Yup.string().label("Path")
})


export async function createOrUpdateNotification({
    values,
    id,
    onSuccess,
    onError,
    onEnd,
  }: {
    values: INotifications;
    id?: string;
    onSuccess: () => void;
    onError: (message: string) => void;
    onEnd?: () => void;
  }) {
    try {
      console.log("Notification values here",values);
      let response;
      if (id) {
        response = await client.patch(`/reels/${id}`, values);
        console.log(values);
      } else {
        response = await client.post("/notification", values);
        console.log("notification values here",values);
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
  