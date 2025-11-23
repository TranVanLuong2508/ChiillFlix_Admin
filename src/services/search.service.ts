import publicAxios from "@/lib/axios/publicAxios";
import { IBackendRes } from "@/types/backend.type";
import { ISearchActorResponse, ISearchDirectorResponse, ISearchFilmResponse, ISearchProducerResponse } from "@/types/search.type";

const SearchService = {
  searchActor: async (query: string): Promise<IBackendRes<ISearchActorResponse>> => {
    return publicAxios.get(`/search/actors`, {
      params: {
        q: query,
      },
    });
  },

  searchDirector: async (query: string): Promise<IBackendRes<ISearchDirectorResponse>> => {
    return publicAxios.get(`/search/directors`, {
      params: {
        q: query,
      },
    });
  },

  searchProducer: async (query: string): Promise<IBackendRes<ISearchProducerResponse>> => {
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