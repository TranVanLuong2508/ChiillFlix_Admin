import publicAxios from "@/lib/axios/publicAxios";
import { IBackendRes } from "@/types/backend.type";
import { IFilmPagination } from "@/types/film.type";

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
  }
}

export default FilmService;