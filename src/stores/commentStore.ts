import { create } from "zustand";
import type { CommentColumn, UpdateCommentDto } from "@/types/comment.type";
import { commentService } from "@/services/commentService";

interface CommentState {
  comments: CommentColumn[];
  allComments: CommentColumn[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  statistics: any;
  loading: boolean;
  error: string | null;
}

interface CommentActions {
  fetchComments: (page?: number, limit?: number, sort?: string, filter?: Record<string, any>) => Promise<void>;
  fetchStatistics: () => Promise<void>;
  updateComment: (commentId: string, dto: UpdateCommentDto) => Promise<boolean>;
  deleteComment: (commentId: string) => Promise<boolean>;
  hardDeleteComment: (commentId: string) => Promise<boolean>;
  toggleHideComment: (commentId: string) => Promise<boolean>;
  clearError: () => void;
}

export const useCommentStore = create<CommentState & CommentActions>((set, get) => ({
  comments: [],
  allComments: [],
  meta: null,
  statistics: null,
  loading: false,
  error: null,

  fetchComments: async (page = 1, limit = 10, sort?: string, filter?: Record<string, any>) => {
    set({ loading: true, error: null });
    try {
      const res = await commentService.getAllComments(1, 1000, sort);
      if (res.EC === 1 && res.data?.comments) {
        const flattenComments = (items: any[]): CommentColumn[] => {
          const result: CommentColumn[] = [];

          const flatten = (item: any, parentFilm?: any) => {
            const filmInfo = item.film || parentFilm;

            result.push({
              commentId: item.commentId,
              content: item.content,
              isHidden: item.isHidden,
              totalLike: item.totalLike,
              totalDislike: item.totalDislike,
              totalChildrenComment: item.totalChildrenComment,
              userName: item.user?.name || item.user?.fullName || "Không rõ",
              userAvatar: item.user?.avatar || item.user?.avatarUrl || "",
              filmTitle: filmInfo?.title || "Không rõ",
              filmId: filmInfo?.filmId || "",
              createdAt: item.createdAt || new Date(),
              updatedAt: item.updatedAt || new Date(),
            });
            if (item.replies && Array.isArray(item.replies)) {
              item.replies.forEach((reply: any) => flatten(reply, filmInfo));
            } else if (item.children && Array.isArray(item.children)) {
              item.children.forEach((child: any) => flatten(child, filmInfo));
            }
          };
          items.forEach((item) => flatten(item, item.film));
          return result;
        };

        let allComments = flattenComments(res.data.comments);
        if (filter) {
          if (filter.filmId) {
            allComments = allComments.filter((c) => c.filmId === filter.filmId);
          }
          if (filter.isHidden !== undefined) {
            allComments = allComments.filter((c) => c.isHidden === filter.isHidden);
          }
          if (filter.userName) {
            const searchTerm = filter.userName.toLowerCase();
            allComments = allComments.filter((c) => c.userName.toLowerCase().includes(searchTerm));
          }
        }

        const total = allComments.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedComments = allComments.slice(startIndex, endIndex);

        console.log(
          `Total: ${total}, Pages: ${totalPages}, Current page: ${page}, Showing: ${paginatedComments.length}`,
        );

        set({
          comments: paginatedComments,
          allComments,
          meta: {
            page,
            limit,
            total,
            totalPages,
          },
          loading: false,
        });
      } else {
        console.error("Failed to fetch comments:", res);
        set({
          error: res.EM || "Failed to fetch comments",
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
    }
  },

  updateComment: async (commentId: string, dto: UpdateCommentDto) => {
    set({ loading: true, error: null });
    try {
      const res = await commentService.updateComment(commentId, dto);
      if (res.EC === 1) {
        await get().fetchComments(get().meta?.page || 1, get().meta?.limit || 10);
        set({ loading: false });
        return true;
      } else {
        set({ error: res.EM || "Failed to update comment", loading: false });
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

  deleteComment: async (commentId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await commentService.deleteComment(commentId);
      if (res.EC === 1) {
        await get().fetchComments(get().meta?.page || 1, get().meta?.limit || 10);
        set({ loading: false });
        return true;
      } else {
        set({ error: res.EM || "Failed to delete comment", loading: false });
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

  hardDeleteComment: async (commentId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await commentService.hardDeleteComment(commentId);
      if (res.EC === 1) {
        await get().fetchComments(get().meta?.page || 1, get().meta?.limit || 10);
        set({ loading: false });
        return true;
      } else {
        set({ error: res.EM || "Failed to hard delete comment", loading: false });
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

  toggleHideComment: async (commentId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await commentService.toggleHideComment(commentId);
      if (res.EC === 1) {
        await get().fetchComments(get().meta?.page || 1, get().meta?.limit || 10);
        set({ loading: false });
        return true;
      } else {
        set({ error: res.EM || "Failed to toggle hide comment", loading: false });
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

  fetchStatistics: async () => {
    set({ loading: true, error: null });
    try {
      const res = await commentService.getStatistics();
      if (res.EC === 1 && res.data) {
        set({ statistics: res.data, loading: false });
      } else {
        set({ error: res.EM || "Failed to fetch statistics", loading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
