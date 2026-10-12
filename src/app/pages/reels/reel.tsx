import * as Yup from 'yup';
import client from '../../modules/service/network';
import { toast } from 'react-toastify';

export interface IReels {
    title: string,
    video: {
        internalFile: {
            video: string | null;
            thumbnail: string | null;
        } | null;
        externalFile: {
            url: string | null;
        } | null;
    };
}

export const initReelsVal: IReels = {
    title: "",
    video: {
        internalFile: {
            video: null,
            thumbnail: null
        },
        externalFile: {
            url: null
        }
    }
};

export const createReelsSchema = Yup.object().shape({
    title: Yup.string()
        .required('Title is required')
        .max(30, 'Title must be at most 30 characters')
        .label('Title'),

    video: Yup.object()
        .shape({
            internalFile: Yup.object().shape({
                video: Yup.string().nullable(),
                thumbnail: Yup.string().nullable(),
            }).nullable(),
            externalFile: Yup.object().shape({
                url: Yup.string().nullable(),
            }).nullable(),
        })
        .test(
            'video-source-required',
            'Either an uploaded video or an external URL is required',
            (value) => {
                if (!value) return false;
                const hasInternalVideo = !!value.internalFile?.video;
                const hasExternalUrl = !!value.externalFile?.url;
                return hasInternalVideo || hasExternalUrl;
            }
        )
});

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
      // Update reel
      response = await client.put(`/reels/${id}${queryParam}`, values);
    } else {
      // Create reel
      response = await client.post(`/reels/admin${queryParam}`, values);
    }

    if (response.status >= 200 && response.status < 300) {
      console.log("========== BACKEND RESPONSE ==========");
      console.log(response);
      console.log("response.data =", response.data);
      console.log("======================================");

      onSuccess(response.data); // ✅ pass response data to onSuccess

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
