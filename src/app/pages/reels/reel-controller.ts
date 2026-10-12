
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

export async function createOrUpdateReels({
    values,
    id,
    notify,
    onSuccess,
    onError,
    onEnd,
}: {
    values: IReels;
    id?: string;
    notify?: string;
    onSuccess: (responseData?: any) => void;
    onError: (message: string) => void;
    onEnd?: () => void;
}) {
    try {
       let response;
    const queryParam = notify ? `?notify=${notify}` : '';

        if (id) {
            response = await client.put(`/reels/${id}${queryParam}`, values);
        } else {
           response = await client.post(`/reels/admin${queryParam}`, values);
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
