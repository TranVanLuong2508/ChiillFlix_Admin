import privateAxios from "@/lib/axios/privateAxios";
import publicAxios from "@/lib/axios/publicAxios";
import { IBackendRes } from "@/types/backend.type";
import { IFilmCreateReq, IFilmCreateRes, IFilmPagination } from "@/types/film.type";

const FilmService = {
  getFilmPagination: (
    current: number,
    pageSize: number,
    query?: any
  ): Promise<IBackendRes<IFilmPagination>> => {
    return publicAxios.get(`/films/admin`, {
      params: {
        current,
        pageSize,
      }
    })
  },
  createFilm: (payload: IFilmCreateReq): Promise<IBackendRes<IFilmCreateRes>> => {
    return privateAxios.post(`/films`, payload)
  }
}

export default FilmService;