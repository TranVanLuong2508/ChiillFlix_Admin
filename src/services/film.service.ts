import privateAxios from "@/lib/axios/privateAxios";
import publicAxios from "@/lib/axios/publicAxios";
import { IBackendRes } from "@/types/backend.type";
import {
  IFilmCreateReq,
  IFilmCreateRes,
  IFilmDeleteRes,
  IFilmDetailRes,
  IFilmPagination,
} from "@/types/film.type";

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
  getFilmDetail: (filmId: string): Promise<IBackendRes<IFilmDetailRes>> => {
    return publicAxios.get(`/films/${filmId}`)
  },
  createFilm: (payload: IFilmCreateReq): Promise<IBackendRes<IFilmCreateRes>> => {
    return privateAxios.post(`/films`, payload)
  },
  deleteFilm: (filmId: string): Promise<IBackendRes<IFilmDeleteRes>> => {
    return privateAxios.delete(`/films/${filmId}`)
  },
  updateFilm: (filmId: string, payload: Partial<IFilmCreateReq>): Promise<IBackendRes<IFilmCreateRes>> => {
    return privateAxios.patch(`/films/${filmId}`, payload)
  }
}

export default FilmService;