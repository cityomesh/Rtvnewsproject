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
  notify,
  onSuccess,
  onError,
  onEnd,
}: {
  values: IPoll;
  id?: string;
  notify?: boolean;
  onSuccess: (responseData?: any) => void;   // ✅ changed to accept data
  onError: (message: string) => void;
  onEnd?: () => void;
}) {
  try {
    let response;
    const queryParam = notify !== undefined ? `?notify=${notify}` : '';

    if (id) {
      response = await client.put(`poll/${id}${queryParam}`, values);
    } else {
      response = await client.post(`/poll${queryParam}`, values);
    }

    if (response.status >= 200 && response.status < 300) {
      onSuccess(response.data);   // ✅ pass response data
      return response.data;
    } else if (response.status === 401 || response.status === 403) {
      toast.error("Please login");
      window.location.reload();
    } else {
      onError("Something went wrong, please try again!");
    }
  } catch (error) {
    console.error(error);
    onError("Something went wrong, please try again!");
  } finally {
    if (onEnd) onEnd();
  }
  return null;
}
