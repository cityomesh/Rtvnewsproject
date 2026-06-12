import { toast } from "react-toastify";
import client, { fetcher } from "../../modules/service/network";
import { IPost } from "./post";
import useSWR from "swr";

export function usePost(id: string, onSuccess: (e: any) => void) {
  const { data, error, isLoading } = useSWR(id ? `/post/${id}` : null, fetcher, {
    onSuccess: (data) => {
      console.log({ data });
      onSuccess(data);
    },
  });
  return {
    post: data,
    isLoading,
    isError: error,
  };
}

// ✅ Updated createOrUpdatePost with notify parameter and returns response data
export async function createOrUpdatePost({
    values,
    id,
    notify,
    onSuccess,
    onError,
    onEnd,
  }: {
    values: IPost;
    id?: string;
    notify?: string;
    onSuccess: (responseData?: any) => void;
    onError: (message: string) => void;
    onEnd?: () => void;
  }) {
    try {
      const queryParam = notify ? `?notify=${notify}` : "";
      let response;
      if (id) {
        response = await client.put(`/post/${id}${queryParam}`, values);
        console.log(values);
      } else {
        response = await client.post(`/post${queryParam}`, values);
        console.log(values);
      }
  
      if (response.status >= 200 && response.status < 300) {
        onSuccess(response.data);   // ✅ pass response data to onSuccess
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
  