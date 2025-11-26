import privateAxios from "@/lib/axios/privateAxios"
import { IBackendRes } from "@/types/backend.type"
import { ICreateEpisodeReq, IEpisodePagination, IUpdateEpisodeRes } from "@/types/episode.type"

const EpisodeService = {
  getAll: (
    current: number,
    pageSize: number,
    partId: string,
    query?: any
  ): Promise<IBackendRes<IEpisodePagination>> => {
    return privateAxios.get('/episodes', {
      params: {
        current,
        pageSize,
        partId,
        query
      }
    })
  },
  createEpisode: (payload: ICreateEpisodeReq): Promise<IBackendRes<IUpdateEpisodeRes>> => {
    return privateAxios.post('/episodes', payload)
  },
}

export default EpisodeService
