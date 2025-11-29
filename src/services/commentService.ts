import privateAxios from "@/lib/axios/privateAxios";
import publicAxios from "@/lib/axios/publicAxios";
import { ICommentPagination, UpdateCommentDto } from "@/types/comment.type";
import { IBackendRes } from "@/types/backend.type";

export const commentService = {
  getAllComments: (
    page: number = 1,
    limit: number = 10,
    sort?: string,
    filter?: Record<string, any>,
  ): Promise<IBackendRes<ICommentPagination>> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (sort) {
      params.append("sort", sort);
    }

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
    }
    return privateAxios.get(`/comment/all-comments?${params.toString()}`);
  },

  getCommentById: (commentId: string): Promise<IBackendRes<any>> => {
    return publicAxios.get(`/comment/get-comment/${commentId}`);
  },

  updateComment: (commentId: string, dto: UpdateCommentDto): Promise<IBackendRes<any>> => {
    return privateAxios.patch(`/comment/update-comment/${commentId}`, dto);
  },

  deleteComment: (commentId: string): Promise<IBackendRes<any>> => {
    return privateAxios.delete(`/comment/delete-comment/${commentId}`);
  },

  toggleHideComment: (commentId: string): Promise<IBackendRes<any>> => {
    return privateAxios.patch(`/comment/toggle-hide/${commentId}`);
  },
};
