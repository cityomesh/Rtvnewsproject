import useSWR from "swr";
import client, { fetcher } from "../../modules/service/network.ts";
import { IMatch, ITeam } from "../matches/match.tsx";
import { toast } from "react-toastify";

interface IUseTeamResponse {
  team: ITeam[] | null;
  isLoading: boolean;
  isError: any;
}

export function useTeam(onSuccess?: (teamData: ITeam[]) => void): IUseTeamResponse {
  const { data, error, isLoading } = useSWR(`/team`, fetcher, {
    onSuccess: (data) => {
      if (data && data._embedded?.team) {
        const teamData = data._embedded.team.map((team: ITeam) => ({
          teamId: team._links?.self.href.split("/").pop() || "",
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

  const team = data && data._embedded?.team
    ? data._embedded.team.map((team: ITeam) => ({
        teamId: team._links?.self.href.split("/").pop() || "",
        teamName: team.teamName,
        teamLogo: team.teamLogo,
        teamState: team.teamState,
        teamThemeColor: team.teamThemeColor,
      }))
    : null;

  return {
    team,
    isLoading,
    isError: error,
  };
}


// export function useTeam(onSuccess: (e: any) => void) {

//     let teamData = null;
//     const { data, error, isLoading } = useSWR(`/team`, fetcher, {
//       onSuccess: (data, key, config) => {
//         if (data && data._embedded && data._embedded.team) {
//           teamData = data._embedded.team.map((team: ITeam) => ({
//             teamId: team._links?.self.href.split("/").pop(),
//             teamName: team.teamName,
//             teamLogo: team.teamLogo,
//             teamState: team.teamState,
//             teamThemeColor: team.teamThemeColor,
//           }));
//           console.log({ teamData });
//           if (onSuccess) {
//             onSuccess(teamData);
//           }
//         }
//       },
//     });
  
//     return {
//       team: teamData,
//       isLoading,
//       isError: error,
//     };
//   }
  