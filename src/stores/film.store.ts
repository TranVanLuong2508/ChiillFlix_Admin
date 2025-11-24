import FilmService from "@/services/film.service";
import { toast } from "sonner";
import { create } from "zustand";

interface IFilmStoreState {
  isLoadingDelete: boolean;
}

interface IFilmStoreAction {
  handleDeletedFilm: (filmId: string) => Promise<void>;
}

export const useFilmStore = create<IFilmStoreState & IFilmStoreAction>((set) => ({
  isLoadingDelete: false,

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