import { toast } from "react-toastify";
import client, { fetcher } from "../../modules/service/network";
import { ICourse } from "./course";
import useSWR from "swr";


export function useCourse(id: string, onSuccess: (e: any) => void) {
  

  const { data, error, isLoading } = useSWR(id ? `/course/${id}` : null, fetcher, {
    onSuccess: (data) => {
      console.log({ data }); // Log the fetched data
      onSuccess(data);
    },
  });
  return {
    course: data,
    isLoading,
    isError: error,
  };
}

export async function createOrUpdateCourse({
    values,
    id,
    onSuccess,
    onError,
    onEnd,
  }: {
    values: ICourse;
    id?: string;
    onSuccess: () => void;
    onError: (message: string) => void;
    onEnd?: () => void;
  }) {
    try {
      let response;
      if (id) {
        response = await client.patch(`/course/${id}`, values);
        console.log(values);
      } else {
        response = await client.post("/course", values);
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
  