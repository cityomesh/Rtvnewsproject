import { toast } from "react-toastify";
import client from "../../modules/service/network";
import { ILesson } from "./lesson";

export async function createOrUpdateLesson({
    values,
    id,
    onSuccess,
    onError,
    onEnd,
  }: {
    values: ILesson;
    id?: string;
    onSuccess: () => void;
    onError: (message: string) => void;
    onEnd?: () => void;
  }) {
    try {
      let response;
      if (id) {
        response = await client.patch(`/course/lessons/${id}`, values);
        console.log(values);
      } else {
        response = await client.post(`/course/${values.courseId}/lessons`, values);
        console.log(values);
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
      console.log(error);
      onError("Something went wrong, please try again!");
    } finally {
      if (onEnd) onEnd();
    }
    return null;
  }
  