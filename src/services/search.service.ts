import publicAxios from "@/lib/axios/publicAxios";
import { IBackendRes } from "@/types/backend.type";
import { IActorSearch, IDirectorSearch, IProducerSearch, ISearchFilmResponse } from "@/types/search.type";

const SearchService = {
  searchActor: async (query: string): Promise<IBackendRes<IActorSearch[]>> => {
    return publicAxios.get(`/search/actors`, {
      params: {
        q: query,
      },
    });
  },

  searchDirector: async (query: string): Promise<IBackendRes<IDirectorSearch[]>> => {
    return publicAxios.get(`/search/directors`, {
      params: {
        q: query,
      },
    });
  },

  searchProducer: async (query: string): Promise<IBackendRes<IProducerSearch[]>> => {
    return publicAxios.get(`/search/producers`, {
      params: {
        q: query,
      },
    });
  },

  callSearchFilm: (
    keyword: string
  ): Promise<IBackendRes<ISearchFilmResponse>> => {
    return publicAxios.get(`/search/films`, {
      params: {
        q: keyword,
      },
    });
  },
}

export default SearchService