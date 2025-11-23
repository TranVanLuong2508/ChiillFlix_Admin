import { create } from "zustand";
import { directorService } from "@/services/directorService";
import type { DirectorColumn } from "@/types/director.type";
import { CreateDirectorDto, UpdateDirectorDto } from "@/types/director.type";

interface DirectorState {
  directors: DirectorColumn[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  loading: boolean;
  error: string | null;
}

interface DirectorActions {
  fetchDirectors: (page?: number, limit?: number, sort?: string, filter?: Record<string, any>) => Promise<void>;
  createDirector: (dto: CreateDirectorDto) => Promise<boolean>;
  updateDirector: (directorId: number, dto: UpdateDirectorDto) => Promise<boolean>;
  deleteDirector: (directorId: number) => Promise<boolean>;
  clearError: () => void;
}

export const useDirectorStore = create<DirectorState & DirectorActions>((set, get) => ({
  directors: [],
  meta: null,
  loading: false,
  error: null,

  fetchDirectors: async (page = 1, limit = 10, sort?: string, filter?: Record<string, any>) => {
    set({ loading: true, error: null });
    try {
      const res = await directorService.getAllDirectors(page, limit, sort, filter);
      if (res.EC === 1 && res.data) {
        const directors = res.data.directors.map((item) => ({
          directorId: item.directorId.toString(),
          directorName: item.directorName,
          slug: item.slug,
          birthDate: item.birthDate,
          genderCode: item.genderCode,
          nationalityCode: item.nationalityCode,
          story: item.story,
          avatarUrl: item.avatarUrl,
          gender: item.genderCodeRL?.valueVi || "",
          nationality: item.nationalityCodeRL?.valueVi || "",
        }));

        set({
          directors,
          meta: res.data.meta,
          loading: false,
        });
      } else {
        console.error("Failed to fetch directors:", res);
        set({
          error: res.EM || "Failed to fetch directors",
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error fetching directors:", error);
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
    }
  },

  createDirector: async (dto: CreateDirectorDto) => {
    set({ loading: true, error: null });
    try {
      const res = await directorService.createDirector(dto);
      if (res.EC === 1) {
        // Refresh the list
        await get().fetchDirectors(get().meta?.page || 1, get().meta?.limit || 10);
        set({ loading: false });
        return true;
      } else {
        set({ error: res.EM || "Failed to create director", loading: false });
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

  updateDirector: async (directorId: number, dto: UpdateDirectorDto) => {
    set({ loading: true, error: null });
    try {
      const res = await directorService.updateDirector(directorId, dto);
      if (res.EC === 1) {
        // Refresh the list
        await get().fetchDirectors(get().meta?.page || 1, get().meta?.limit || 10);
        set({ loading: false });
        return true;
      } else {
        set({ error: res.EM || "Failed to update director", loading: false });
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

  deleteDirector: async (directorId: number) => {
    set({ loading: true, error: null });
    try {
      const res = await directorService.deleteDirector(directorId);
      if (res.EC === 1) {
        // Refresh the list
        await get().fetchDirectors(get().meta?.page || 1, get().meta?.limit || 10);
        set({ loading: false });
        return true;
      } else {
        set({ error: res.EM || "Failed to delete director", loading: false });
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
