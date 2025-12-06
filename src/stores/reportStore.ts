import { create } from "zustand";
import { commentService } from "@/services/commentService";
import { ratingService } from "@/services/ratingService";
import { toast } from "sonner";

export interface Report {
  reportId: string;
  reportType: "COMMENT" | "RATING";
  targetId: string;
  targetData?: {
    commentId?: string;
    content?: string;
    user?: {
      userId: number;
      fullName: string;
    };
    createdAt?: string;
    film?: {
      filmId?: string;
      title: string;
      slug: string;
    };
    ratingId?: string;
    ratingValue?: number;
  };
  reporter: {
    userId: number;
    fullName: string;
  };
  reason: string;
  description?: string;
  status: "PENDING" | "DISMISSED" | "ACTIONED";
  createdAt: string;
  reviewedBy?: {
    userId: number;
    fullName: string;
  };
  reviewedAt?: string;
  reviewNote?: string;
}

interface ReportState {
  reports: Report[];
  loading: boolean;
  statusFilter: string;
  reportType: "COMMENT" | "RATING";
  error: string | null;
}

interface ReportActions {
  setReportType: (type: "COMMENT" | "RATING") => void;
  setStatusFilter: (status: string) => void;
  fetchReports: (status?: string) => Promise<void>;
  dismissReport: (reportId: string, note?: string) => Promise<boolean>;
  deleteTargetFromReport: (reportId: string, reason: string, note?: string) => Promise<boolean>;
  hardDeleteTargetFromReport: (reportId: string, note?: string) => Promise<boolean>;
  clearError: () => void;
}

export const useReportStore = create<ReportState & ReportActions>((set, get) => ({
  reports: [],
  loading: false,
  statusFilter: "PENDING",
  reportType: "COMMENT",
  error: null,

  setReportType: (type: "COMMENT" | "RATING") => {
    set({ reportType: type });
    get().fetchReports();
  },

  setStatusFilter: (status: string) => {
    set({ statusFilter: status });
    get().fetchReports(status);
  },

  fetchReports: async (status?: string) => {
    const filterStatus = status || get().statusFilter;
    const currentReportType = get().reportType;
    set({ loading: true, error: null });

    try {
      const service = currentReportType === "COMMENT" ? commentService : ratingService;
      const res = await service.getReports({
        status: filterStatus === "ALL" ? undefined : filterStatus,
        page: 1,
        limit: 50,
      });

      if (res?.data?.EC === 1 || res.data.reports) {
        set({ reports: res.data.reports || [], loading: false });
      } else {
        console.error("Invalid response structure:", res);
        set({ reports: [], loading: false, error: "Invalid response structure" });
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      const errorMessage = error instanceof Error ? error.message : "Không thể tải danh sách báo cáo";
      set({
        reports: [],
        loading: false,
        error: errorMessage,
      });
      toast.error(errorMessage);
    }
  },

  dismissReport: async (reportId: string, note?: string) => {
    const currentReportType = get().reportType;
    try {
      const service = currentReportType === "COMMENT" ? commentService : ratingService;
      const res = await service.dismissReport(reportId, note);

      if (res && (res.data?.EC === 1 || res.EC === 1)) {
        toast.success("Đã từ chối báo cáo thành công");
        await get().fetchReports();
        return true;
      } else {
        console.error("Dismiss failed response:", res);
        toast.error(res?.data?.EM || res?.EM || "Có lỗi xảy ra khi từ chối báo cáo");
        return false;
      }
    } catch (error) {
      console.error("Dismiss error:", error);
      toast.error("Không thể từ chối báo cáo");
      return false;
    }
  },

  deleteTargetFromReport: async (reportId: string, reason: string, note?: string) => {
    const currentReportType = get().reportType;
    try {
      let res;
      if (currentReportType === "COMMENT") {
        res = await commentService.hideFromReport(reportId, reason, note);
      } else {
        res = await ratingService.deleteFromReport(reportId, reason, note);
      }

      if (res && (res.data?.EC === 1 || res.EC === 1)) {
        toast.success("Đã xử lý vi phạm thành công");
        await get().fetchReports();
        return true;
      } else {
        console.error("Delete target failed response:", res);
        toast.error(res?.data?.EM || res?.EM || "Có lỗi xảy ra khi xử lý vi phạm");
        return false;
      }
    } catch (error) {
      console.error("Delete target error:", error);
      toast.error("Không thể xử lý báo cáo");
      return false;
    }
  },

  hardDeleteTargetFromReport: async (reportId: string, note?: string) => {
    const currentReportType = get().reportType;
    try {
      let res;
      if (currentReportType === "COMMENT") {
        res = await commentService.hardDeleteFromReport(reportId, note);
      } else {
        res = await ratingService.hardDeleteFromReport(reportId, note);
      }

      if (res && (res.data?.EC === 1 || res.EC === 1)) {
        toast.success("Đã xóa vĩnh viễn thành công");
        await get().fetchReports();
        return true;
      } else {
        console.error("Hard delete target failed response:", res);
        toast.error(res?.data?.EM || res?.EM || "Có lỗi xảy ra khi xóa vĩnh viễn");
        return false;
      }
    } catch (error) {
      console.error("Hard delete target error:", error);
      toast.error("Không thể xóa vĩnh viễn");
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
