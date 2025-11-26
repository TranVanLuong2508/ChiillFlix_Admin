import privateAxios from "@/lib/axios/privateAxios"
import { IBackendRes } from "@/types/backend.type"
import { ICreateEpisodeReq, ICreateEpisodeRes, IEpisodePagination, IUpdateEpisodeRes } from "@/types/episode.type"

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
  createEpisode: (payload: ICreateEpisodeReq): Promise<IBackendRes<ICreateEpisodeRes>> => {
    return privateAxios.post('/episodes', payload)
  },
  updateEpisode: (episodeId: string, payload: ICreateEpisodeReq): Promise<IBackendRes<IUpdateEpisodeRes>> => {
    return privateAxios.patch(`/episodes/${episodeId}`, payload)
  },
  deleteEpisode: (episodeId: string): Promise<IBackendRes<any>> => {
    return privateAxios.delete(`/episodes/${episodeId}`)
  }
}

export default EpisodeService
