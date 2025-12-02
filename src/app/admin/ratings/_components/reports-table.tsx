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
import { MoreHorizontal, Star, AlertTriangle, XCircle, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { socket } from "@/lib/socket";
import { useNotificationStore } from "@/stores/notificationStore";
import { useReportStore, type Report } from "@/stores/reportStore";
import { useRatingStore } from "@/stores/ratingStore";

export function ReportsTable() {
    const {
        reports,
        loading,
        statusFilter,
        setReportType,
        setStatusFilter,
        fetchReports,
        dismissReport,
        deleteTargetFromReport
    } = useReportStore();

    const { hideRating } = useRatingStore();

    const [dismissDialog, setDismissDialog] = useState<{ open: boolean; report: Report | null }>({
        open: false,
        report: null,
    });
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; report: Report | null }>({
        open: false,
        report: null,
    });
    const [hideDialog, setHideDialog] = useState<{ open: boolean; report: Report | null }>({
        open: false,
        report: null,
    });
    const [viewDialog, setViewDialog] = useState<{ open: boolean; report: Report | null }>({
        open: false,
        report: null,
    });

    const [dismissNote, setDismissNote] = useState("");
    const [hideReason, setHideReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setReportType("RATING");
        fetchReports();
    }, [setReportType, fetchReports]);

    useEffect(() => {
        const handleNewReport = () => {
            if (statusFilter === 'PENDING' || statusFilter === 'ALL') {
                fetchReports();
            }
        };

        socket.on('reportNotification', handleNewReport);

        return () => {
            socket.off('reportNotification', handleNewReport);
        };
    }, [statusFilter, fetchReports]);

    const { fetchUnreadCount, fetchNotifications } = useNotificationStore();

    const handleDismiss = async () => {
        if (!dismissDialog.report) return;
        setIsSubmitting(true);

        const success = await dismissReport(dismissDialog.report.reportId, dismissNote);

        if (success) {
            setDismissDialog({ open: false, report: null });
            setDismissNote("");
            fetchUnreadCount();
            fetchNotifications(1, 20);
        }

        setIsSubmitting(false);
    };

    const handleDelete = async () => {
        if (!deleteDialog.report) return;
        setIsSubmitting(true);

        const success = await deleteTargetFromReport(deleteDialog.report.reportId, "Vi phạm quy tắc cộng đồng", "");

        if (success) {
            setDeleteDialog({ open: false, report: null });
            fetchUnreadCount();
            fetchNotifications(1, 20);
        }

        setIsSubmitting(false);
    };

    const handleHide = async () => {
        if (!hideDialog.report || !hideReason) return;
        setIsSubmitting(true);

        const success = await deleteTargetFromReport(hideDialog.report.reportId, hideReason, "");

        if (success) {
            setHideDialog({ open: false, report: null });
            setHideReason("");
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
                                <TableHead>Đánh giá</TableHead>
                                <TableHead>Nội dung</TableHead>
                                <TableHead>Người đánh giá</TableHead>
                                <TableHead>Người báo cáo</TableHead>
                                <TableHead>Lý do</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                                        Đang tải...
                                    </TableCell>
                                </TableRow>
                            ) : reports.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
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
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                <span className="font-semibold">{report.targetData?.ratingValue?.toFixed(1) || "N/A"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {report.targetData
                                                ? (report.targetData.content || <span className="text-gray-400 italic">Không có nội dung</span>)
                                                : <span className="text-gray-400 italic">Đánh giá đã bị xóa</span>
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {report.targetData?.user?.fullName || <span className="text-gray-400">Unknown</span>}
                                        </TableCell>
                                        <TableCell>{report.reporter?.fullName || "Unknown"}</TableCell>
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
                                                                setDismissDialog({ open: true, report });
                                                            }}
                                                        >
                                                            Từ chối (Không vi phạm)
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setHideDialog({ open: true, report });
                                                            }}
                                                            className="text-orange-600"
                                                        >
                                                            Ẩn đánh giá
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDeleteDialog({ open: true, report });
                                                            }}
                                                            className="text-red-600"
                                                        >
                                                            Xóa & Cảnh cáo
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
                                <h4 className="font-medium text-sm text-gray-500 mb-2">Nội dung đánh giá</h4>
                                <div className="flex items-center gap-2 mb-2">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold">{viewDialog.report.targetData?.ratingValue?.toFixed(1) || "N/A"}</span>
                                </div>
                                <p className="whitespace-pre-wrap">{viewDialog.report.targetData?.content || "Không có nội dung"}</p>
                                <div className="mt-2 text-sm text-gray-500 flex gap-4">
                                    <span>Bởi: {viewDialog.report.targetData?.user?.fullName || "Unknown"}</span>
                                    {viewDialog.report.targetData?.film && (
                                        <span>Phim: {viewDialog.report.targetData.film.title}</span>
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
                                            setDismissDialog({ open: true, report: viewDialog.report });
                                            setViewDialog({ open: false, report: null });
                                        }}
                                    >
                                        Từ chối
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            setDeleteDialog({ open: true, report: viewDialog.report });
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
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <DialogTitle>Từ chối báo cáo</DialogTitle>
                                <DialogDescription className="mt-1">
                                    Xác nhận đánh giá này không vi phạm quy tắc cộng đồng
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {dismissDialog.report?.targetData && (
                        <div className="rounded-lg border bg-gray-50 p-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{dismissDialog.report.targetData.ratingValue?.toFixed(1)}</span>
                                <span className="text-gray-400">•</span>
                                <span>{dismissDialog.report.targetData.user?.fullName}</span>
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-2">
                                {dismissDialog.report.targetData.content || <span className="italic text-gray-400">Không có nội dung</span>}
                            </p>
                        </div>
                    )}

                    <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                        <div className="flex gap-2">
                            <AlertCircle className="h-4 w-4 text-green-600 mt-0.5 " />
                            <div className="text-sm text-green-700">
                                <p className="font-medium">Hành động này sẽ:</p>
                                <ul className="mt-1 list-disc list-inside space-y-0.5 text-green-600">
                                    <li>Đánh dấu báo cáo là "Không vi phạm"</li>
                                    <li>Gửi thông báo cho người báo cáo</li>
                                    <li>Đánh giá sẽ được giữ nguyên</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDismissDialog({ open: false, report: null })}
                            disabled={isSubmitting}
                            className="flex-1 sm:flex-none"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            onClick={handleDismiss}
                            disabled={isSubmitting}
                            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                        >
                            {isSubmitting ? "Đang xử lý..." : "Xác nhận từ chối"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={hideDialog.open} onOpenChange={(open) => setHideDialog({ ...hideDialog, open })}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                                <EyeOff className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <DialogTitle>Ẩn đánh giá</DialogTitle>
                                <DialogDescription className="mt-1">
                                    Đánh giá sẽ bị ẩn khỏi trang phim
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {hideDialog.report?.targetData && (
                        <div className="rounded-lg border bg-gray-50 p-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{hideDialog.report.targetData.ratingValue?.toFixed(1)}</span>
                                <span className="text-gray-400">•</span>
                                <span>{hideDialog.report.targetData.user?.fullName}</span>
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-2">
                                {hideDialog.report.targetData.content || <span className="italic text-gray-400">Không có nội dung</span>}
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Lý do vi phạm <span className="text-red-500">*</span>
                        </label>
                        <Select value={hideReason} onValueChange={setHideReason}>
                            <SelectTrigger className="mt-1.5">
                                <SelectValue placeholder="Chọn lý do vi phạm..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Ngôn từ thô tục, xúc phạm">Ngôn từ thô tục, xúc phạm</SelectItem>
                                <SelectItem value="Phát tán thông tin sai sự thật">Phát tán thông tin sai sự thật</SelectItem>
                                <SelectItem value="Quảng cáo, spam, lừa đảo">Quảng cáo, spam, lừa đảo</SelectItem>
                                <SelectItem value="Kích động bạo lực, thù ghét">Kích động bạo lực, thù ghét</SelectItem>
                                <SelectItem value="Nội dung khiêu dâm, đồi trụy">Nội dung khiêu dâm, đồi trụy</SelectItem>
                                <SelectItem value="Tiết lộ thông tin cá nhân">Tiết lộ thông tin cá nhân</SelectItem>
                                <SelectItem value="Bắt nạt, quấy rối người khác">Bắt nạt, quấy rối người khác</SelectItem>
                                <SelectItem value="Vi phạm pháp luật, bản quyền">Vi phạm pháp luật, bản quyền</SelectItem>
                                <SelectItem value="Nội dung không liên quan đến phim">Nội dung không liên quan đến phim</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                        <div className="flex gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 " />
                            <div className="text-sm text-orange-700">
                                <p className="font-medium">Hành động này sẽ:</p>
                                <ul className="mt-1 list-disc list-inside space-y-0.5 text-orange-600">
                                    <li>Ẩn đánh giá khỏi trang phim</li>
                                    <li>Đánh giá không tính vào điểm trung bình</li>
                                    <li>Gửi cảnh cáo nhẹ cho người dùng</li>
                                    <li>Có thể hiện lại trong quản lý đánh giá</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setHideDialog({ open: false, report: null })}
                            disabled={isSubmitting}
                            className="flex-1 sm:flex-none"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            onClick={handleHide}
                            disabled={!hideReason || isSubmitting}
                            className="flex-1 sm:flex-none bg-orange-600 hover:bg-orange-700"
                        >
                            {isSubmitting ? "Đang xử lý..." : "Xác nhận ẩn"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <DialogTitle>Xóa đánh giá & Cảnh cáo</DialogTitle>
                                <DialogDescription className="mt-1">
                                    Hành động này không thể hoàn tác
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {deleteDialog.report?.targetData && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{deleteDialog.report.targetData.ratingValue?.toFixed(1)}</span>
                                <span className="text-gray-400">•</span>
                                <span>{deleteDialog.report.targetData.user?.fullName}</span>
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-2">
                                {deleteDialog.report.targetData.content || <span className="italic text-gray-400">Không có nội dung</span>}
                            </p>
                        </div>
                    )}

                    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                        <div className="flex gap-2">
                            <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                            <div className="text-sm text-red-700">
                                <p className="font-medium">Hành động này sẽ:</p>
                                <ul className="mt-1 list-disc list-inside space-y-0.5 text-red-600">
                                    <li>Xóa vĩnh viễn đánh giá này</li>
                                    <li>Gửi cảnh cáo vi phạm cho người dùng</li>
                                    <li>Thông báo cho người báo cáo</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialog({ open: false, report: null })}
                            disabled={isSubmitting}
                            className="flex-1 sm:flex-none"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="flex-1 sm:flex-none"
                        >
                            {isSubmitting ? "Đang xử lý..." : "Xóa & Cảnh cáo"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
