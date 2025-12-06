import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import { IRatingPagination } from "@/types/rating.type";

export const ratingService = {
  getAllRatings: (
    page: number = 1,
    limit: number = 10,
    sort?: string,
    filter?: Record<string, any>,
  ): Promise<IBackendRes<IRatingPagination>> => {
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
    return privateAxios.get(`/rating/all-ratings?${params.toString()}`);
  },

  getStatistics: (): Promise<IBackendRes<any>> => {
    return privateAxios.get(`/rating/statistics`);
  },

  deleteRating: (ratingId: string): Promise<IBackendRes<any>> => {
    return privateAxios.delete(`/rating/delete-rating/${ratingId}`);
  },

  restoreRating: (ratingId: string): Promise<IBackendRes<any>> => {
    return privateAxios.patch(`/rating/admin-restore/${ratingId}`);
  },

  hideRating: (ratingId: string): Promise<IBackendRes<any>> => {
    return privateAxios.patch(`/rating/hide/${ratingId}`);
  },

  unhideRating: (ratingId: string): Promise<IBackendRes<any>> => {
    return privateAxios.patch(`/rating/unhide/${ratingId}`);
  },

  hardDeleteRating: (ratingId: string): Promise<IBackendRes<any>> => {
    return privateAxios.delete(`/rating/hard-delete/${ratingId}`);
  },

  getReports: (query: { status?: string; page?: number; limit?: number }): Promise<IBackendRes<any>> => {
    const params = new URLSearchParams();
    params.append("reportType", "RATING");
    if (query.status) params.append("status", query.status);
    if (query.page) params.append("page", query.page.toString());
    if (query.limit) params.append("limit", query.limit.toString());
    return privateAxios.get(`/report?${params.toString()}`);
  },

  dismissReport: (reportId: string, note?: string): Promise<IBackendRes<any>> => {
    return privateAxios.post(`/report/${reportId}/dismiss`, { note });
  },

  deleteFromReport: (reportId: string, reason: string, note?: string): Promise<IBackendRes<any>> => {
    return privateAxios.post(`/report/${reportId}/delete-target`, { reason, note });
  },

  hardDeleteFromReport: (reportId: string, note?: string): Promise<IBackendRes<any>> => {
    return privateAxios.post(`/report/${reportId}/hard-delete-target`, { note });
  },
};
