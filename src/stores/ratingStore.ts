import { create } from "zustand";
import type { RatingColumn } from "@/types/rating.type";
import { ratingService } from "@/services/ratingService";

interface RatingState {
  ratings: RatingColumn[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  statistics: any | null;
  loading: boolean;
  error: string | null;
}

interface RatingActions {
  fetchRatings: (page?: number, limit?: number, sort?: string, filter?: Record<string, any>) => Promise<void>;
  fetchStatistics: () => Promise<void>;
  deleteRating: (ratingId: string) => Promise<boolean>;
  restoreRating: (ratingId: string) => Promise<boolean>;
  hideRating: (ratingId: string) => Promise<boolean>;
  unhideRating: (ratingId: string) => Promise<boolean>;
  hardDeleteRating: (ratingId: string) => Promise<boolean>;
  clearError: () => void;
}

export const useRatingStore = create<RatingState & RatingActions>((set, get) => ({
  ratings: [],
  meta: null,
  statistics: null,
  loading: false,
  error: null,

  fetchRatings: async (page = 1, limit = 10, sort?: string, filter?: Record<string, any>) => {
    set({ loading: true, error: null });
    try {
      const res = await ratingService.getAllRatings(page, limit, sort, filter);
      if (res.EC === 1 && res.data?.ratings) {
        const mappedRatings: RatingColumn[] = res.data.ratings.map((r: any) => ({
          ratingId: r.ratingId,
          ratingValue: r.ratingValue,
          content: r.content || "",
          userName: r.user?.fullName || "Không rõ",
          userAvatar: r.user?.avatarUrl || "",
          userId: r.user?.userId,
          filmTitle: r.film?.title || "Không rõ",
          filmId: r.film?.filmId || "",
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
          deletedAt: r.deletedAt,
          isHidden: r.isHidden || false,
        }));

        set({
          ratings: mappedRatings,
          meta: res.data.meta,
          loading: false,
        });
      } else {
        set({
          error: res.EM || "Failed to fetch ratings",
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
    }
  },

  fetchStatistics: async () => {
    set({ loading: true, error: null });
    try {
      const res = await ratingService.getStatistics();
      if (res.EC === 1) {
        set({
          statistics: res.data.result,
          loading: false,
        });
      } else {
        set({
          error: res.EM || "Failed to fetch statistics",
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
    }
  },

  deleteRating: async (ratingId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await ratingService.deleteRating(ratingId);
      if (res.EC === 1) {
        await get().fetchRatings(get().meta?.page || 1, get().meta?.limit || 10);
        set({ loading: false });
        return true;
      } else {
        set({ error: res.EM || "Failed to delete rating", loading: false });
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

  restoreRating: async (ratingId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await ratingService.restoreRating(ratingId);
      if (res.EC === 1) {
        await get().fetchRatings(get().meta?.page || 1, get().meta?.limit || 10);
        set({ loading: false });
        return true;
      } else {
        set({ error: res.EM || "Failed to restore rating", loading: false });
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

  hideRating: async (ratingId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await ratingService.hideRating(ratingId);
      if (res.EC === 1) {
        await get().fetchRatings(get().meta?.page || 1, get().meta?.limit || 10);
        set({ loading: false });
        return true;
      } else {
        set({ error: res.EM || "Failed to hide rating", loading: false });
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

  unhideRating: async (ratingId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await ratingService.unhideRating(ratingId);
      if (res.EC === 1) {
        await get().fetchRatings(get().meta?.page || 1, get().meta?.limit || 10);
        set({ loading: false });
        return true;
      } else {
        set({ error: res.EM || "Failed to unhide rating", loading: false });
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

  hardDeleteRating: async (ratingId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await ratingService.hardDeleteRating(ratingId);
      if (res.EC === 1) {
        await get().fetchRatings(get().meta?.page || 1, get().meta?.limit || 10);
        set({ loading: false });
        return true;
      } else {
        set({ error: res.EM || "Failed to hard delete rating", loading: false });
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
