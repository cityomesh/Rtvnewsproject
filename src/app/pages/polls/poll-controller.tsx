import { toast } from "react-toastify";
import client, { fetcher } from "../../modules/service/network";
import { IPoll } from "./poll";
import useSWR from "swr";



export function usePoll(id: string, onSuccess: (e: any) => void) {
  
  const { data, error, isLoading } = useSWR(id ? `poll/${id}` : null, fetcher, {
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
  return {
    quiz: data,
    isLoading,
    isError: error,
  };
}



export async function createOrUpdatePoll({
    values,
    id,
    onSuccess,
    onError,
    onEnd,
  }: {
    values: IPoll;
    id?: string;
    onSuccess: () => void;
    onError: (message: string) => void;
    onEnd?: () => void;
  }) {
    try {
      let response;
      if (id) {
        response = await client.put(`poll/${id}`, values);
      } else {
        response = await client.post("/poll", values);
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
      onError("Something went wrong, please try again!");
    } finally {
      if (onEnd) onEnd();
    }
    return null;
  }
