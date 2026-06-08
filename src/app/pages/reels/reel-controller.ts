import client , { fetcher }  from "../../modules/service/network.ts"
import {IReels} from "./reel.tsx"
import { toast } from "react-toastify"
import useSWR from "swr";
import ReelCard from "./ReelCard.tsx";


export function useReel(id: string, onSuccess: (e: any) => void) {
  
    const { data, error, isLoading } = useSWR(id ? `/reels/${id}` : null, fetcher, {
      onSuccess: (data) => {
        onSuccess(data);
      },
    });
    return {
      reel: data,
      isLoading,
      isError: error,
    };
  }