// /* eslint-disable @typescript-eslint/no-explicit-any */
// import client , { fetcher }  from "../../modules/service/network.ts"
// import {IQuiz} from "./quiz.tsx"
// import { toast } from "react-toastify"
// import useSWR from "swr";

// export function useQuiz(id: string, onSuccess: (e: any) => void) {
  
//   const { data, error, isLoading } = useSWR(id ? `/quiz/${id}` : null, fetcher, {
//     onSuccess: (data) => {
//       onSuccess(data);
//     },
//   });
//   return {
//     quiz: data,
//     isLoading,
//     isError: error,
//   };
// }

// export async function createOrUpdateQuiz({
//     values,
//     id,
//     notify,      // ✅ new parameter for notification
//     onSuccess,
//     onError,
//     onEnd,
//   }: {
//     values: IQuiz;
//     id?: string;
//     notify?: string;   // "true" or "false"
//     onSuccess: () => void;
//     onError: (message: string) => void;
//     onEnd?: () => void;
//   }) {
//     try {
//       let response;
//       // ✅ Append notify query parameter if provided
//       const queryParam = notify ? `?notify=${notify}` : '';
      
//       if (id) {
//         response = await client.put(`/quiz/${id}${queryParam}`, values);
//       } else {
//         response = await client.post(`/quiz${queryParam}`, values);
//       }
  
//       if (response.status >= 200 && response.status < 300) {
//         onSuccess();
//         return response.data;
//       } else if (response.status === 401 || response.status === 403) {
//         toast.error("Please login");
//         window.location.reload();
//       } else {
//         onError("Something went wrong, please try again!");
//       }
//     } catch (error) {
//       console.log(error);
//       onError("Something went wrong, please try again!");
//     } finally {
//       if (onEnd) onEnd();
//     }
//     return null;
//   }


/* eslint-disable @typescript-eslint/no-explicit-any */
import client , { fetcher }  from "../../modules/service/network.ts"
import {IQuiz} from "./quiz.tsx"
import { toast } from "react-toastify"
import useSWR from "swr";

export function useQuiz(id: string, onSuccess: (e: any) => void) {
  
  const { data, error, isLoading } = useSWR(id ? `/quiz/${id}` : null, fetcher, {
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
  return {
    quiz: data,
    isLoading,
    isError: error,
  };
}

export async function createOrUpdateQuiz({
    values,
    id,
    notify,
    onSuccess,
    onError,
    onEnd,
  }: {
    values: IQuiz;
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
        response = await client.put(`/quiz/${id}${queryParam}`, values);
      } else {
        response = await client.post(`/quiz${queryParam}`, values);
      }
  
      if (response.status >= 200 && response.status < 300) {
        onSuccess(response.data);   // ✅ pass response.data to onSuccess
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
  