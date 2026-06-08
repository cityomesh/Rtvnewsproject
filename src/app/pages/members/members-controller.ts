import client , { fetcher }  from "../../modules/service/network.ts"
import {IPlayer} from "./players.tsx"
import { toast } from "react-toastify"
import useSWR from "swr";
interface IUsePlayerResponse {
  player: any | null;
  isLoading: boolean;
  isError: any;
  
}

export function usePlayer(id: string, onSuccess?: (data: any) => void): IUsePlayerResponse {
  const { data, error, isLoading } = useSWR(id ? `/members/${id}` : null, fetcher, {
    onSuccess: (data) => {
      if (data) {
        console.log({ data }); // Log the fetched data
        if (onSuccess) {
          onSuccess(data);
        }
      }
    },
  });

  return {
    player: data || null,
    isLoading,
    isError: error,
    
  };
}



// export function usePlayer(id: string, onSuccess: (e: any) => void) {
//   // if (!id) {
//   //   return {
//   //     quiz: null,
//   //     isLoading: false,
//   //     isError: false,
//   //   };
//   // }

//   // const { data, error, isLoading } = useSWR(`/quiz/${id}`, fetcher, {
//   //   onSuccess: (data, key, config) => {
//   //     console.log({ data }); //this always prints "undefined"
//   //     onSuccess(data);
//   //   },
//   // });
//   // return {
//   //   quiz: data,
//   //   isLoading,
//   //   isError: error,
//   // };

//   const { data, error, isLoading } = useSWR(id ? `/members/${id}` : null, fetcher, {
//     onSuccess: (data) => {
//       console.log({ data }); // Log the fetched data
//       onSuccess(data);
//     },
//   });
//   return {
//     player: data,
//     isLoading,
//     isError: error,
//   };
// }

