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
}

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
                if (!value) return false;  // If no video or external file object
                const hasInternalVideo = !!value.internalFile?.video;
                const hasExternalUrl = !!value.externalFile?.url;
                return hasInternalVideo || hasExternalUrl;
            }
        )
});


export async function createOrUpdateReels({
    values,
    id,
    onSuccess,
    onError,
    onEnd,
  }: {
    values: IReels;
    id?: string;
    onSuccess: () => void;
    onError: (message: string) => void;
    onEnd?: () => void;
  }) {
    try {
      let response;
      if (id) {
        response = await client.put(`/reels/${id}`, values);
      } else {
        response = await client.post("/reels/admin", values);
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
      console.log("error in saving ",error);
      onError("Something went wrong, please try again!");
    } finally {
      if (onEnd) onEnd();
    }
    return null;
  }
  