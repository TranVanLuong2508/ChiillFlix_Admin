import { create } from "zustand";
import z from "zod";
import { toast } from "sonner";

import FilmService from "@/services/film.service";

import { IFilmDetailRes } from "@/types/film.type";
import { formSchema } from "@/lib/validators/film";

interface IFilmStoreState {
  isLoadingDelete: boolean;

  isLoadingDetail: boolean;
  filmDetailRaw: IFilmDetailRes | null;
  filmDataUpdate: z.infer<typeof formSchema> | null;
}

interface IFilmStoreAction {
  handleDeletedFilm: (filmId: string) => Promise<void>;
  handleFetchDetailFilm: (filmId: string) => Promise<void>;
}

export const useFilmStore = create<IFilmStoreState & IFilmStoreAction>((set) => ({
  isLoadingDelete: false,

  isLoadingDetail: false,
  filmDetailRaw: null,
  filmDataUpdate: null,

  handleFetchDetailFilm: async (filmId: string) => {
    set({ isLoadingDetail: true });
    try {
      console.log("Check id: ", filmId);
      const res = await FilmService.getFilmDetail(filmId);
      if (res.EC === 0 && res.data) {
        const dataFilmDetail = {
          originalTitle: res.data.film.originalTitle,
          title: res.data.film.title,
          description: res.data.film.description,
          releaseDate: res.data.film.releaseDate,
          year: res.data.film.year,
          slug: res.data.film.slug,
          thumbUrl: res.data.film.thumbUrl,
          duration: (res.data.film.duration).toString(),
          ageCode: res.data.film.age.keyMap,
          typeCode: res.data.film.type.keyMap,
          genreCodes: res.data.film.genres.map((genre) => genre.keyMap),
          countryCode: res.data.film.country.keyMap,
          langCode: res.data.film.language.keyMap,
          publicStatusCode: res.data.film.publicStatus.keyMap,
          filmImages: res.data.film.filmImages,
          directors: res.data.directors.map((director) => ({
            directorId: director.directorId,
            isMain: director.isMain,
          })),
          actors: res.data.actors.map((actor) => ({
            actorId: actor.actorId,
            characterName: actor.characterName,
          })),
          producers: res.data.producers.map((producer) => ({
            producerId: producer.producerId,
            isMain: producer.isMain,
          })),
        }

        set({
          filmDetailRaw: res.data,
          filmDataUpdate: dataFilmDetail,
        })
      } else {
        toast.error(res.EM);
      }
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoadingDetail: false });
    }
  },

  handleDeletedFilm: async (filmId: string) => {
    set({ isLoadingDelete: true });
    try {
      const res = await FilmService.deleteFilm(filmId);
      if (res.EC === 0 && res.data) {
        toast.success(res.EM);
      } else {
        toast.error(res.EM);
      }
    } catch (error) {
      console.log("Error when delete film", error)
      toast.error("Error when delete film")
    } finally {
      set({ isLoadingDelete: false });
    }
  },
}))