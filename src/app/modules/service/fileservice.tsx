/* eslint-disable @typescript-eslint/ban-types */
import client from "./network";
import axios, {AxiosError} from "axios";

type UploadedFile = {
  relativePath: string,
  id: string,
  url: string
}

const fileService = async (file: any, type: string)=>{
    try{
    const formDataImage = new FormData();
    formDataImage.append('file', file);
    formDataImage.append('type', type);

    const responseFile = await client.post(`/rtv/file/upload`, formDataImage, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return responseFile.data.url
    }
    catch(err){
        throw `the error is ${err}`
    }   
}


export const uploadFile = async ({file, type, onSuccess, onError}: {
  file: any, type: string,
  onSuccess?: (data: UploadedFile) => void,
  onError?: (code: string, message: String) => void
}) => {
  try {
    const formDataImage = new FormData();
    formDataImage.append('file', file);
    formDataImage.append('type', type);

    const responseFile = await client.post(`/rtv/file/upload`, formDataImage, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if(onSuccess) onSuccess(responseFile.data);
    return responseFile.data
  } catch (err: any) {
    if(axios.isAxiosError(err)){
      const e = err as AxiosError
      if(onError) onError(e.code!, e.message)
    }else{
      if(onError) onError("500", "Something went wrong")
    }
  }
  return null
}

export const uploadVideoAndThumbnail = async ({file, videoPath, thumbnailPath, onSuccess, onError}: {
  file: any, videoPath: string, thumbnailPath: string,
  onSuccess?: (data: UploadedFile) => void,
  onError?: (code: string, message: String) => void
}) => {
  try {
    const formDataImage = new FormData();
    formDataImage.append('file', file);
    formDataImage.append('videoPath', videoPath);
    formDataImage.append('thumbnailPath', thumbnailPath);
    const responseFile = await client.post('/rtv/videoAndThumbnailUpload', formDataImage, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if(onSuccess) onSuccess(responseFile.data);
    return responseFile.data
  } catch (err: any) {
    console.log(err);
    if(axios.isAxiosError(err)){
      const e = err as AxiosError
      if(onError) onError(e.code!, e.message)
    }else{
      if(onError) onError("500", "Something went wrong")
    }
  }
  return null
}

export default fileService;