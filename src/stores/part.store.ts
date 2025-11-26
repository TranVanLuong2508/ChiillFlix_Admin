import z from "zod";
import { create } from "zustand";
import { toast } from "sonner";

import { formPartSchema } from "@/lib/validators/part";
import PartService from "@/services/part.service";


interface IPartStoreProps {
  hasUpdateData: boolean;
}

interface IPartStoreActions {
  handleUpdatePart: (filmId: string, partId: string, values: z.infer<typeof formPartSchema>) => Promise<void>
  resetHasUpdateData: () => void;
  handleDeletePart: (partId: string) => Promise<void>
}

export const usePartStore = create<IPartStoreProps & IPartStoreActions>((set) => ({
  hasUpdateData: false,

  resetHasUpdateData: () => set({ hasUpdateData: false }),
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
  }
}))