import privateAxios from "@/lib/axios/privateAxios";
import publicAxios from "@/lib/axios/publicAxios";
import { IBackendRes } from "@/types/backend.type";
import {
  IFilmCreateReq,
  IFilmCreateRes,
  IFilmDeletedPagination,
  IFilmDeleteRes,
  IFilmDetailRes,
  IFilmHardDeleteRes,
  IFilmPagination,
  IFilmRestoreRes,
} from "@/types/film.type";

const FilmService = {
  getFilmPagination: (
    current: number,
    pageSize: number,
  ): Promise<IBackendRes<IFilmPagination>> => {
    return publicAxios.get(`/films/admin`, {
      params: {
        current,
        pageSize,
      }
    })
  },
  getFilmDeletedPagination: (
    current: number,
    pageSize: number,
  ): Promise<IBackendRes<IFilmDeletedPagination>> => {
    return publicAxios.get(`/films/admin/deleted`, {
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
  },

  hardDelete: (filmId: string): Promise<IBackendRes<IFilmHardDeleteRes>> => {
    return privateAxios.delete(`/films/admin/hard_delete/${filmId}`)
  },

  restoreFilm: (filmId: string): Promise<IBackendRes<IFilmRestoreRes>> => {
    return privateAxios.post(`/films/admin/restore/${filmId}`)
  }
}

export default FilmService;