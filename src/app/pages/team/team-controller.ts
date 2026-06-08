import useSWR from "swr";
import client ,{fetcher} from "../../modules/service/network.ts";
import {ITeam} from "./team.tsx";
import {toast} from "react-toastify";

export function useTeam(id: string,onSuccess: (e:any)=>void) {
  
  const { data, error, isLoading } = useSWR(id ? `/team/${id}` : null, fetcher, {
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
  return {
    team: data,
    isLoading,
    isError: error,
  };
}

export async function createOrUpdateTeam({values, id, onSuccess, onError, onEnd}: {
  values: ITeam, id?: string,
  onSuccess: () => void,
  onError: (message: string) => void,
  onEnd?: () => void
}) {
  try {
    let response;
    if (id) {
      response = await client.patch(`/team/${id}`, values);
    } else {
      response = await client.post("/team", values);
    }

    if (response.status >= 200 && response.status < 300) {
      onSuccess();
      return response.data
    } else if (response.status === 401 || response.status === 403) {
      toast.error("Please login");
      window.location.reload();
    } else {
      onError("Something went wrong, please try again!")
    }
  } catch (error) {
    console.log(error);
    onError("Something went wrong, please try again!")
  } finally {
    if (onEnd) onEnd()
  }
  return null
}
