import privateAxios from "@/lib/axios/privateAxios"
import { formPartSchema } from "@/lib/validators/part"
import { IBackendRes } from "@/types/backend.type"
import { IPartCreateReq, IPartCreateRes, IPartGetAll } from "@/types/part.type"
import z from "zod"

const PartService = {

  getAllParts: (filmId: string): Promise<IBackendRes<IPartGetAll>> => {
    return privateAxios.post(`/parts/film`, { filmId })
  },
  createPart: (part: IPartCreateReq): Promise<IBackendRes<IPartCreateRes>> => {
    return privateAxios.post("/parts", part)

  },
  updatePart: (partId: string, part: z.infer<typeof formPartSchema>): Promise<IBackendRes<IPartCreateRes>> => {
    return privateAxios.patch(`/parts/${partId}`, part)
  }
}

export default PartService