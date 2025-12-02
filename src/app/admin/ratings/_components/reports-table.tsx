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
import { MoreHorizontal, Star } from "lucide-react";
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

    const [dismissDialog, setDismissDialog] = useState<{ open: boolean; reportId: string | null }>({
        open: false,
        reportId: null,
    });
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; reportId: string | null }>({
        open: false,
        reportId: null,
    });
    const [hideDialog, setHideDialog] = useState<{ open: boolean; reportId: string | null; ratingId: string | null }>({
        open: false,
        reportId: null,
        ratingId: null,
    });
    const [viewDialog, setViewDialog] = useState<{ open: boolean; report: Report | null }>({
        open: false,
        report: null,
    });

    const [dismissNote, setDismissNote] = useState("");
    const [deleteReason, setDeleteReason] = useState("");
    const [deleteNote, setDeleteNote] = useState("");
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

    const handleDelete = async () => {
        if (!deleteDialog.reportId || !deleteReason) return;
        setIsSubmitting(true);

        const success = await deleteTargetFromReport(deleteDialog.reportId, deleteReason, deleteNote);

        if (success) {
            setDeleteDialog({ open: false, reportId: null });
            setDeleteReason("");
            setDeleteNote("");
            fetchUnreadCount();
            fetchNotifications(1, 20);
        }

        setIsSubmitting(false);
    };

    const handleHide = async () => {
        if (!hideDialog.reportId) return;
        setIsSubmitting(true);

        const success = await deleteTargetFromReport(hideDialog.reportId, "Vi phạm nguyên tắc cộng đồng", "Đã ẩn đánh giá");

        if (success) {
            setHideDialog({ open: false, reportId: null, ratingId: null });
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
                                                                setDismissDialog({ open: true, reportId: report.reportId });
                                                            }}
                                                        >
                                                            Từ chối (Không vi phạm)
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setHideDialog({
                                                                    open: true,
                                                                    reportId: report.reportId,
                                                                    ratingId: report.targetData?.ratingId || null
                                                                });
                                                            }}
                                                            className="text-orange-600"
                                                        >
                                                            Ẩn đánh giá
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDeleteDialog({ open: true, reportId: report.reportId });
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
                                            setDismissDialog({ open: true, reportId: viewDialog.report!.reportId });
                                            setViewDialog({ open: false, report: null });
                                        }}
                                    >
                                        Từ chối
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            setDeleteDialog({ open: true, reportId: viewDialog.report!.reportId });
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
                        <DialogTitle>Ẩn đánh giá</DialogTitle>
                        <DialogDescription>
                            Đánh giá này sẽ bị ẩn khỏi trang phim. Bạn có thể hiện lại sau trong quản lý đánh giá.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setHideDialog({ open: false, reportId: null, ratingId: null })}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleHide}
                            disabled={isSubmitting}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            {isSubmitting ? "Đang xử lý..." : "Ẩn đánh giá"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xóa đánh giá & Cảnh cáo</DialogTitle>
                        <DialogDescription>
                            Đánh giá sẽ bị xóa và người dùng sẽ nhận được cảnh cáo. Người báo cáo sẽ được thông báo.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Lý do vi phạm *</label>
                            <Select value={deleteReason} onValueChange={setDeleteReason}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn lý do..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Spam">Spam</SelectItem>
                                    <SelectItem value="Ngôn từ gây thù ghét">Ngôn từ gây thù ghét</SelectItem>
                                    <SelectItem value="Quấy rối">Quấy rối</SelectItem>
                                    <SelectItem value="Nội dung không phù hợp">Nội dung không phù hợp</SelectItem>
                                    <SelectItem value="Thông tin sai lệch">Thông tin sai lệch</SelectItem>
                                    <SelectItem value="Đánh giá giả mạo">Đánh giá giả mạo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Textarea
                            placeholder="Ghi chú thêm (tùy chọn)..."
                            value={deleteNote}
                            onChange={(e) => setDeleteNote(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog({ open: false, reportId: null })} disabled={isSubmitting}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={!deleteReason || isSubmitting}>
                            {isSubmitting ? "Đang xử lý..." : "Xác nhận xóa"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
