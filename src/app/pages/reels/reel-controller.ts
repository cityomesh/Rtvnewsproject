import client, { fetcher } from "../../modules/service/network";
import { IReels } from "./reel";
import { toast } from "react-toastify";
import useSWR from "swr";

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
