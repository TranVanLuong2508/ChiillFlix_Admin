import z from "zod";
import { create } from "zustand";
import { toast } from "sonner";

import { formPartSchema } from "@/lib/validators/part";
import PartService from "@/services/part.service";
import { formEpisodeSchema } from "@/lib/validators/episode";
import EpisodeService from "@/services/episode.service";
import { generateSlug } from "@/utils/generateSlug";


interface IPartStoreProps {
  hasUpdateData: boolean;
  hasUpdateEpisode: boolean;
}

interface IPartStoreActions {
  handleUpdatePart: (filmId: string, partId: string, values: z.infer<typeof formPartSchema>) => Promise<void>
  handleDeletePart: (partId: string) => Promise<void>

  handleUpdateEpisode: (partId: string, episodeId: string, values: z.infer<typeof formEpisodeSchema>) => Promise<void>
  handleDeleteEpisode: (episodeId: string) => Promise<void>

  resetHasUpdateData: () => void;
  resetHasUpdateEpisode: () => void;
}

export const usePartStore = create<IPartStoreProps & IPartStoreActions>((set) => ({
  hasUpdateData: false,
  hasUpdateEpisode: false,

  resetHasUpdateData: () => set({ hasUpdateData: false }),
  resetHasUpdateEpisode: () => set({ hasUpdateEpisode: false }),

  handleUpdatePart: async (filmId, partId, values) => {
    try {
      const payload = {
        ...values,
        partNumber: Number(values.partNumber),
        filmId: filmId
      }
      const res = await PartService.updatePart(partId, payload);
      if (res.EC === 0 && res.data) {
        toast.success(res.EM);
        set({ hasUpdateData: true });
      } else {
        toast.error(res.EM);
        set({ hasUpdateData: false });
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
      console.log("Error Update Part: ", error);
    }
  },
  handleDeletePart: async (partId) => {
    try {
      const res = await PartService.deletePart(partId);
      if (res.EC === 0 && res.data) {
        toast.success(res.EM);
        set({ hasUpdateData: true });
      } else {
        toast.error(res.EM);
        set({ hasUpdateData: false });
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
      console.log("Error Delete Part: ", error);
    }
  },

  handleUpdateEpisode: async (partId, episodeId, values) => {
    try {
      const payload = {
        ...values,
        slug: generateSlug(values.title),
        episodeNumber: Number(values.episodeNumber),
        duration: Number(values.duration),
        partId: partId,
      }
      const res = await EpisodeService.updateEpisode(episodeId, payload);
      if (res.EC === 0 && res.data) {
        toast.success(res.EM);
        set({ hasUpdateEpisode: true });
      } else {
        toast.error(res.EM);
        set({ hasUpdateEpisode: false });
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
      console.log("Error Update Episode: ", error);
    }
  },

  handleDeleteEpisode: async (episodeId) => {
    try {
      const res = await EpisodeService.deleteEpisode(episodeId);
      if (res.EC === 0 && res.data) {
        toast.success(res.EM);
        set({ hasUpdateEpisode: true });
      } else {
        toast.error(res.EM);
        set({ hasUpdateEpisode: false });
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
      console.log("Error Delete Episode: ", error);
    }
  }

}))