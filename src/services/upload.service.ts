import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";

const UploadService = {
  uploadFile: (file: File): Promise<IBackendRes<{ url: string; createdAt: string }>> => {
    const formData = new FormData();
    formData.append("file", file);

    return privateAxios.post(`/file/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default UploadService;
