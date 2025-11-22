import publicAxios from "@/lib/axios/publicAxios";
import { IBackendRes } from "@/types/backend.type";
import { FilmColumn } from "@/types/film.type";
import { queryObjects } from "v8";

const FilmService = {
  getFilmPagination: (
    current: number,
    pageSize: number,
    query: any
  ): Promise<IBackendRes<FilmColumn>> => {
    return publicAxios.get(`/film/admin`, {
      params: {
        current,
        pageSize,
      }
    })
  }
}

export default FilmService;