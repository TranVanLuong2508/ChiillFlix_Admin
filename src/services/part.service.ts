import privateAxios from "@/lib/axios/privateAxios"
import { IBackendRes } from "@/types/backend.type"
import {
  IPartCreateReq,
  IPartCreateRes,
  IPartDeleteRes,
  IPartGetAll,
  IPartUpdateRes
} from "@/types/part.type"

const PartService = {

  getAllParts: (filmId: string): Promise<IBackendRes<IPartGetAll>> => {
    return privateAxios.post(`/parts/film`, { filmId })
  },
  createPart: (part: IPartCreateReq): Promise<IBackendRes<IPartCreateRes>> => {
    return privateAxios.post("/parts", part)

  },
  updatePart: (partId: string, part: IPartCreateReq): Promise<IBackendRes<IPartUpdateRes>> => {
    return privateAxios.patch(`/parts/${partId}`, part)
  },
  deletePart: (partId: string): Promise<IBackendRes<IPartDeleteRes>> => {
    return privateAxios.delete(`/parts/${partId}`)
  }
}

export default PartService