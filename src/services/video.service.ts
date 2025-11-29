import privateAxios from "@/lib/axios/privateAxios";
import publicAxios from "@/lib/axios/publicAxios";
import { IBackendRes } from "@/types/backend.type";

interface IVideoRes {
  id: string,
  status: string,
  duration: number,
  playbackId: string,
  playbackUrl: string,
  thumbnail: string,
}


const VideoService = {
  createURLUpload: (payload: {
    title: string,
    description: string
  }): Promise<IBackendRes<{ url: string, uploadId: string }>> => {
    return privateAxios.post(`/video/upload-url`, payload)
  },

  getVideo: (uploadId: string): Promise<IBackendRes<IVideoRes>> => {
    return publicAxios.get(`/video/upload/${uploadId}`)
  },
}

export default VideoService;