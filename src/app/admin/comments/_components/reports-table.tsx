"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal } from "lucide-react";
import { socket } from "@/lib/socket";
import { useNotificationStore } from "@/stores/notificationStore";
import { useReportStore, type Report } from "@/stores/reportStore";
import { useCommentStore } from "@/stores/commentStore";
import { toast } from "sonner";

export function ReportsTable() {
    const {
        reports,
        loading,
        statusFilter,
        setReportType,
        setStatusFilter,
        fetchReports,
        dismissReport,
        deleteTargetFromReport,
        hardDeleteTargetFromReport
    } = useReportStore();

    const { hardDeleteComment } = useCommentStore();

    const [dismissDialog, setDismissDialog] = useState<{ open: boolean; reportId: string | null }>({
        open: false,
        reportId: null,
    });
    const [hideDialog, setHideDialog] = useState<{ open: boolean; reportId: string | null }>({
        open: false,
        reportId: null,
    });
    const [hardDeleteDialog, setHardDeleteDialog] = useState<{ open: boolean; reportId: string | null; commentId: string | null }>({
        open: false,
        reportId: null,
        commentId: null,
    });
    const [viewDialog, setViewDialog] = useState<{ open: boolean; report: Report | null }>({
        open: false,
        report: null,
    });

    const [dismissNote, setDismissNote] = useState("");
    const [hideReason, setHideReason] = useState("");
    const [hideNote, setHideNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setReportType("COMMENT");
        fetchReports();
    }, [setReportType, fetchReports]);

    useEffect(() => {
        fetchReports();
    }, [statusFilter, fetchReports]);

    useEffect(() => {
        const handleNewReport = () => {
            if (statusFilter === 'PENDING' || statusFilter === 'ALL') {
                fetchReports();
            }
        };

        const handleReportProcessed = () => {
            fetchReports();
        };

        socket.on('reportNotification', handleNewReport);
        socket.on('reportProcessed', handleReportProcessed);

        return () => {
            socket.off('reportNotification', handleNewReport);
            socket.off('reportProcessed', handleReportProcessed);
        };
    }, [statusFilter, fetchReports]);

    const { fetchUnreadCount, fetchNotifications } = useNotificationStore();

    const handleDismiss = async () => {
        if (!dismissDialog.reportId) return;
        setIsSubmitting(true);

        const success = await dismissReport(dismissDialog.reportId, dismissNote);

        if (success) {
            setDismissDialog({ open: false, reportId: null });
            setDismissNote("");
            fetchUnreadCount();
            fetchNotifications(1, 20);
        }

        setIsSubmitting(false);
    };

    const handleHide = async () => {
        if (!hideDialog.reportId || !hideReason) return;
        setIsSubmitting(true);

        const success = await deleteTargetFromReport(hideDialog.reportId, hideReason, hideNote);

        if (success) {
            setHideDialog({ open: false, reportId: null });
            setHideReason("");
            setHideNote("");
            fetchUnreadCount();
            fetchNotifications(1, 20);
        }

        setIsSubmitting(false);
    };

    const handleHardDelete = async () => {
        if (!hardDeleteDialog.reportId) return;
        setIsSubmitting(true);

        const success = await hardDeleteTargetFromReport(hardDeleteDialog.reportId);

        if (success) {
            setHardDeleteDialog({ open: false, reportId: null, commentId: null });
            fetchUnreadCount();
            fetchNotifications(1, 20);
        }

        setIsSubmitting(false);
    };

    return (
        <>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Quản lý báo cáo</h2>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                            <SelectItem value="DISMISSED">Đã từ chối</SelectItem>
                            <SelectItem value="ACTIONED">Đã xử lý</SelectItem>
                            <SelectItem value="ALL">Tất cả</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Thời gian</TableHead>
                                <TableHead>Loại</TableHead>
                                <TableHead>Nội dung</TableHead>
                                <TableHead>Người tạo</TableHead>
                                <TableHead>Người báo cáo</TableHead>
                                <TableHead>Lý do</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                        Đang tải...
                                    </TableCell>
                                </TableRow>
                            ) : reports.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                        Không có báo cáo nào
                                    </TableCell>
                                </TableRow>
                            ) : (
                                reports.map((report) => (
                                    <TableRow
                                        key={report.reportId}
                                        className="cursor-pointer hover:bg-gray-50"
                                        onClick={() => setViewDialog({ open: true, report })}
                                    >
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    report.status === "PENDING"
                                                        ? "destructive"
                                                        : report.status === "DISMISSED"
                                                            ? "secondary"
                                                            : "default"
                                                }
                                            >
                                                {report.status === "PENDING" ? "Chờ xử lý" :
                                                    report.status === "DISMISSED" ? "Đã từ chối" : "Đã xử lý"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {new Date(report.createdAt).toLocaleString("vi-VN")}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {report.reportType === "COMMENT" ? "Bình luận" : "Đánh giá"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {report.targetData
                                                ? (report.targetData.content || <span className="text-gray-400 italic">Không có nội dung</span>)
                                                : <span className="text-gray-400 italic">
                                                    {report.reportType === "COMMENT" ? "Bình luận đã bị xóa" : "Đánh giá đã bị xóa"}
                                                </span>
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {report.targetData?.user?.fullName || <span className="text-gray-400">Không rõ</span>}
                                        </TableCell>
                                        <TableCell>{report.reporter?.fullName || "Không rõ"}</TableCell>
                                        <TableCell className="text-sm">{report.reason}</TableCell>
                                        <TableCell className="text-right">
                                            {report.status === "PENDING" && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDismissDialog({ open: true, reportId: report.reportId });
                                                            }}
                                                        >
                                                            Từ chối (Không vi phạm)
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setHideDialog({ open: true, reportId: report.reportId });
                                                            }}
                                                            className="text-red-600"
                                                        >
                                                            Ẩn & Cảnh cáo
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setHardDeleteDialog({
                                                                    open: true,
                                                                    reportId: report.reportId,
                                                                    commentId: report.targetData?.commentId || null
                                                                });
                                                            }}
                                                            className="text-red-800 font-semibold"
                                                        >
                                                            Xóa vĩnh viễn
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={viewDialog.open} onOpenChange={(open) => setViewDialog({ ...viewDialog, open })}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Chi tiết báo cáo</DialogTitle>
                    </DialogHeader>
                    {viewDialog.report && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-sm text-gray-500">Người báo cáo</h4>
                                    <p>{viewDialog.report.reporter?.fullName}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm text-gray-500">Thời gian</h4>
                                    <p>{new Date(viewDialog.report.createdAt).toLocaleString("vi-VN")}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm text-gray-500">Lý do</h4>
                                    <p className="text-red-600 font-medium">{viewDialog.report.reason}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm text-gray-500">Trạng thái</h4>
                                    <Badge variant={viewDialog.report.status === "PENDING" ? "destructive" : "secondary"}>
                                        {viewDialog.report.status === "PENDING" ? "Chờ xử lý" :
                                            viewDialog.report.status === "DISMISSED" ? "Đã từ chối" : "Đã xử lý"}
                                    </Badge>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-sm text-gray-500 mb-2">
                                    Nội dung {viewDialog.report.reportType === "COMMENT" ? "bình luận" : "đánh giá"}
                                </h4>
                                <p className="whitespace-pre-wrap">
                                    {viewDialog.report.targetData
                                        ? (viewDialog.report.targetData.content || <span className="text-gray-400 italic">Không có nội dung</span>)
                                        : <span className="text-gray-400 italic">
                                            {viewDialog.report.reportType === "COMMENT" ? "Bình luận đã bị xóa" : "Đánh giá đã bị xóa"}
                                        </span>
                                    }
                                </p>
                                <div className="mt-2 text-sm text-gray-500 flex gap-4">
                                    <span>Bởi: {viewDialog.report.targetData?.user?.fullName || "Không rõ"}</span>
                                    {viewDialog.report.targetData?.film && (
                                        <span>Phim: {viewDialog.report.targetData.film.title}</span>
                                    )}
                                    {viewDialog.report.reportType === "RATING" && viewDialog.report.targetData?.ratingValue && (
                                        <span>Điểm: {viewDialog.report.targetData.ratingValue}/10</span>
                                    )}
                                </div>
                            </div>

                            {viewDialog.report.description && (
                                <div>
                                    <h4 className="font-medium text-sm text-gray-500">Mô tả thêm</h4>
                                    <p className="text-sm">{viewDialog.report.description}</p>
                                </div>
                            )}

                            {viewDialog.report.status === "PENDING" && (
                                <DialogFooter className="gap-2 sm:gap-0">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setDismissDialog({ open: true, reportId: viewDialog.report!.reportId });
                                            setViewDialog({ open: false, report: null });
                                        }}
                                    >
                                        Từ chối
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            setHideDialog({ open: true, reportId: viewDialog.report!.reportId });
                                            setViewDialog({ open: false, report: null });
                                        }}
                                    >
                                        Xử lý vi phạm
                                    </Button>
                                </DialogFooter>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={dismissDialog.open} onOpenChange={(open) => setDismissDialog({ ...dismissDialog, open })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Từ chối báo cáo</DialogTitle>
                        <DialogDescription>
                            Báo cáo này sẽ được đánh dấu là không vi phạm. Người báo cáo sẽ nhận được thông báo.
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        placeholder="Ghi chú (tùy chọn)..."
                        value={dismissNote}
                        onChange={(e) => setDismissNote(e.target.value)}
                        className="min-h-[100px]"
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDismissDialog({ open: false, reportId: null })} disabled={isSubmitting}>
                            Hủy
                        </Button>
                        <Button onClick={handleDismiss} disabled={isSubmitting}>
                            {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={hideDialog.open} onOpenChange={(open) => setHideDialog({ ...hideDialog, open })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ẩn bình luận & Cảnh cáo</DialogTitle>
                        <DialogDescription>
                            Bình luận sẽ bị ẩn và người dùng sẽ nhận được cảnh cáo. Người báo cáo sẽ được thông báo.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Lý do vi phạm *</label>
                            <Select value={hideReason} onValueChange={setHideReason}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn lý do..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Spam">Spam</SelectItem>
                                    <SelectItem value="Ngôn từ gây thù ghét">Ngôn từ gây thù ghét</SelectItem>
                                    <SelectItem value="Quấy rối">Quấy rối</SelectItem>
                                    <SelectItem value="Nội dung không phù hợp">Nội dung không phù hợp</SelectItem>
                                    <SelectItem value="Thông tin sai lệch">Thông tin sai lệch</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Textarea
                            placeholder="Ghi chú thêm (tùy chọn)..."
                            value={hideNote}
                            onChange={(e) => setHideNote(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setHideDialog({ open: false, reportId: null })} disabled={isSubmitting}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleHide} disabled={!hideReason || isSubmitting}>
                            {isSubmitting ? "Đang xử lý..." : "Xác nhận ẩn"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Hard Delete Dialog */}
            <Dialog open={hardDeleteDialog.open} onOpenChange={(open) => setHardDeleteDialog({ ...hardDeleteDialog, open })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Xóa vĩnh viễn bình luận</DialogTitle>
                        <DialogDescription asChild>
                            <div className="space-y-2">
                                <p>Bạn có chắc chắn muốn <strong className="text-red-600">XÓA VĨNH VIỄN</strong> bình luận này?</p>
                                <p className="text-red-600 font-bold">
                                    CẢNH BÁO: Hành động này sẽ xóa vĩnh viễn bình luận và TẤT CẢ bình luận con. Không thể khôi phục!
                                </p>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setHardDeleteDialog({ open: false, reportId: null, commentId: null })}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleHardDelete}
                            disabled={isSubmitting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isSubmitting ? "Đang xóa..." : "Xóa vĩnh viễn"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
