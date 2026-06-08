import { toast } from "react-toastify";

export const uploadSizeLimit = (fileSize: number) => {
  const MAX_SIZE_MB = 100;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
    if (fileSize > MAX_SIZE_BYTES) {
      toast.error(`File is too large. Please select a video less than ${MAX_SIZE_MB}MB.`);
      return false;
    }

    return true;
}
