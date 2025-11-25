import { create } from "zustand";
import type { ActorColumn, CreateActorDto, UpdateActorDto } from "@/types/actor.type";
import { actorService } from "@/services/actorService";
interface ActorState {
  actors: ActorColumn[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  loading: boolean;
  error: string | null;
}

interface ActorActions {
  fetchActors: (page?: number, limit?: number, sort?: string, filter?: Record<string, any>) => Promise<void>;
  createActor: (dto: CreateActorDto) => Promise<boolean>;
  updateActor: (actorId: number, dto: UpdateActorDto) => Promise<boolean>;
  deleteActor: (actorId: number) => Promise<boolean>;
  clearError: () => void;
}

export const useActorStore = create<ActorState & ActorActions>((set, get) => ({
  actors: [],
  meta: null,
  loading: false,
  error: null,

  fetchActors: async (page = 1, limit = 10, sort?: string, filter?: Record<string, any>) => {
    set({ loading: true, error: null });
    try {
      const res = await actorService.getAllActors(page, limit, sort, filter);
      if (res.EC === 1 && res.data) {
        console.log("Actor data from API:", res.data.actors[0]); // Debug log
        const actors = res.data.actors.map((item) => ({
          actorId: item.actorId.toString(),
          actorName: item.actorName,
          slug: item.slug,
          birthDate: item.birthDate,
          genderCode: item.genderCode,
          nationalityCode: item.nationalityCode,
          shortBio: item.shortBio ?? "",
          avatarUrl: item.avatarUrl,
          gender: item.genderActor?.valueVi || "",
          nationality: item.nationalityActor?.valueVi || "",
        }));
        console.log("Mapped actor:", actors[0]); // Debug log

        set({
          actors,
          meta: res.data.meta,
          loading: false,
        });
      } else {
        console.error("Failed to fetch actors:", res);
        set({
          error: res.EM || "Failed to fetch actors",
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error fetching actors:", error);
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
    }
  },

  createActor: async (dto: CreateActorDto) => {
    set({ loading: true, error: null });
    try {
      const res = await actorService.createActor(dto);
      if (res.EC === 1) {
        // Refresh the list
        await get().fetchActors(get().meta?.page || 1, get().meta?.limit || 10);
        set({ loading: false });
        return true;
      } else {
        set({ error: res.EM || "Failed to create actor", loading: false });
        return false;
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
      return false;
    }
  },

  updateActor: async (actorId: number, dto: UpdateActorDto) => {
    set({ loading: true, error: null });
    try {
      const res = await actorService.updateActor(actorId, dto);
      if (res.EC === 1) {
        // Refresh the list
        await get().fetchActors(get().meta?.page || 1, get().meta?.limit || 10);
        set({ loading: false });
        return true;
      } else {
        set({ error: res.EM || "Failed to update actor", loading: false });
        return false;
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
      return false;
    }
  },

  deleteActor: async (actorId: number) => {
    set({ loading: true, error: null });
    try {
      const res = await actorService.deleteActor(actorId);
      if (res.EC === 1) {
        // Refresh the list
        await get().fetchActors(get().meta?.page || 1, get().meta?.limit || 10);
        set({ loading: false });
        return true;
      } else {
        set({ error: res.EM || "Failed to delete actor", loading: false });
        return false;
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
