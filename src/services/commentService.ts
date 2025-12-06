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

  hardDeleteComment: (commentId: string): Promise<IBackendRes<any>> => {
    return privateAxios.delete(`/comment/hard-delete-comment/${commentId}`);
  },

  toggleHideComment: (commentId: string): Promise<IBackendRes<any>> => {
    return privateAxios.patch(`/comment/toggle-hide/${commentId}`);
  },

  // Reports endpoints
  getReports: (query: { status?: string; page?: number; limit?: number }): Promise<IBackendRes<any>> => {
    const params = new URLSearchParams();
    params.append("reportType", "COMMENT");
    if (query.status) params.append("status", query.status);
    if (query.page) params.append("page", query.page.toString());
    if (query.limit) params.append("limit", query.limit.toString());
    return privateAxios.get(`/report?${params.toString()}`);
  },

  dismissReport: (reportId: string, note?: string): Promise<IBackendRes<any>> => {
    return privateAxios.post(`/report/${reportId}/dismiss`, { note });
  },

  hideFromReport: (reportId: string, reason: string, note?: string): Promise<IBackendRes<any>> => {
    return privateAxios.post(`/report/${reportId}/delete-target`, { reason, note });
  },

  hardDeleteFromReport: (reportId: string, note?: string): Promise<IBackendRes<any>> => {
    return privateAxios.post(`/report/${reportId}/hard-delete-target`, { note });
  },

  getStatistics: (): Promise<IBackendRes<any>> => {
    return privateAxios.get("/comment/statistics");
  },
};
