import useSWR from "swr";
import client, { fetcher } from "../../modules/service/network.ts";
import { IMatch, ITeam } from "./match.tsx";
import { toast } from "react-toastify";

export function useMatch(id: string, onSuccess: (e: any) => void) {
  
  const { data, error, isLoading } = useSWR(id ? `/matches/${id}` : null, fetcher, {
    onSuccess: (data) => {
      console.log( "data in edit mode",data ); // Log the fetched data
      onSuccess(data);
    },
  });
  return {
    match: data,
    isLoading,
    isError: error,
  };
}

export function useTeam(onSuccess: (e: any) => void) {

  let teamData = null;
  const { data, error, isLoading } = useSWR(`/team`, fetcher, {
    onSuccess: (data, key, config) => {
      if (data && data._embedded && data._embedded.team) {
        teamData = data._embedded.team.map((team: ITeam) => ({
          teamId: team._links?.self.href.split("/").pop(),
          teamName: team.teamName,
          teamLogo: team.teamLogo,
          teamState: team.teamState,
          teamThemeColor: team.teamThemeColor,
        }));
        console.log({ teamData });
        if (onSuccess) {
          onSuccess(teamData);
        }
      }
    },
  });

  return {
    team: teamData,
    isLoading,
    isError: error,
  };
}

export const getYearOptions = (startYear: number, range: number): string[] => {
  const options: string[] = [];
  for (let i = 0; i < range; i++) {
    const currentYear = startYear + i;
    options.push(`${currentYear}-${currentYear + 1}`);
  }
  return options;
};

export async function createOrUpdateMatch({
  values,
  id,
  onSuccess,
  onError,
  onEnd,
}: {
  values: IMatch;
  id?: string;
  onSuccess: () => void;
  onError: (message: string) => void;
  onEnd?: () => void;
}) {
  try {
    let response;
    if (id) {
      response = await client.patch(`/match/${id}`, values);
      console.log("inside match controller",values);
    } else {
      response = await client.post("/match", values);
      console.log("inside match controller", values);
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
