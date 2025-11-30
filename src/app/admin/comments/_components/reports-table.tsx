"use client";

import { useEffect, useState } from "react";
import { commentService } from "@/services/commentService";
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
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import { socket } from "@/lib/socket";
import { useNotificationStore } from "@/stores/notificationStore";

interface Report {
    reportId: string;
    comment: {
        commentId: string;
        content: string;
        user: {
            userId: number;
            fullName: string;
        };
        createdAt: string;
        film?: {
            title: string;
            slug: string;
        };
    };
    reporter: {
        userId: number;
        fullName: string;
    };
    reason: string;
    description?: string;
    status: "PENDING" | "DISMISSED" | "ACTIONED";
    duplicateCount: number;
    createdAt: string;
}

export function ReportsTable() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("PENDING");

    const [dismissDialog, setDismissDialog] = useState<{ open: boolean; reportId: string | null }>({
        open: false,
        reportId: null,
    });
    const [hideDialog, setHideDialog] = useState<{ open: boolean; reportId: string | null }>({
        open: false,
        reportId: null,
    });
    const [viewDialog, setViewDialog] = useState<{ open: boolean; report: Report | null }>({
        open: false,
        report: null,
    });

    const [dismissNote, setDismissNote] = useState("");
    const [hideReason, setHideReason] = useState("");
    const [hideNote, setHideNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await commentService.getReports({ status: statusFilter, page: 1, limit: 50 });
            if (res && res.data && res.data.EC === 1) {
                setReports(res.data.reports || []);
            }
        } catch (error) {
            console.error("Error fetching reports:", error);
            toast.error("Không thể tải danh sách báo cáo");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [statusFilter]);

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
    }, [statusFilter]);

    const { fetchUnreadCount, fetchNotifications } = useNotificationStore();

    const handleDismiss = async () => {
        if (!dismissDialog.reportId) return;
        setIsSubmitting(true);

        try {
            const res = await commentService.dismissReport(dismissDialog.reportId, dismissNote);
            if (res && (res.data?.EC === 1 || res.EC === 1)) {
                toast.success("Đã từ chối báo cáo thành công");
                setDismissDialog({ open: false, reportId: null });
                setDismissNote("");
                fetchReports();
                fetchUnreadCount();
                fetchNotifications(1, 20);
            } else {
                console.error("Dismiss failed response:", res);
                toast.error(res?.data?.EM || res?.EM || "Có lỗi xảy ra khi từ chối báo cáo");
            }
        } catch (error) {
            console.error("Dismiss error:", error);
            toast.error("Không thể từ chối báo cáo");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleHide = async () => {
        if (!hideDialog.reportId || !hideReason) return;
        setIsSubmitting(true);

        try {
            const res = await commentService.hideFromReport(hideDialog.reportId, hideReason, hideNote);
            if (res && (res.data?.EC === 1 || res.EC === 1)) {
                toast.success("Đã xử lý vi phạm thành công");
                setHideDialog({ open: false, reportId: null });
                setHideReason("");
                setHideNote("");
                fetchReports();
                fetchUnreadCount();
                fetchNotifications(1, 20);
            } else {
                console.error("Hide failed response:", res);
                toast.error(res?.data?.EM || res?.EM || "Có lỗi xảy ra khi xử lý vi phạm");
            }
        } catch (error) {
            console.error("Hide error:", error);
            toast.error("Không thể ẩn bình luận");
        } finally {
            setIsSubmitting(false);
        }
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
                                <TableHead>Số lượng</TableHead>
                                <TableHead>Nội dung</TableHead>
                                <TableHead>Người bình luận</TableHead>
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
                                            <Badge variant="outline">{report.duplicateCount}</Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {report.comment?.content || <span className="text-gray-400 italic">Bình luận đã bị xóa</span>}
                                        </TableCell>
                                        <TableCell>
                                            {report.comment?.user?.fullName || <span className="text-gray-400">Unknown</span>}
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
                                                                setHideDialog({ open: true, reportId: report.reportId });
                                                            }}
                                                            className="text-red-600"
                                                        >
                                                            Ẩn & Cảnh cáo
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
                                <h4 className="font-medium text-sm text-gray-500 mb-2">Nội dung bình luận</h4>
                                <p className="whitespace-pre-wrap">{viewDialog.report.comment?.content || "Bình luận đã bị xóa"}</p>
                                <div className="mt-2 text-sm text-gray-500 flex gap-4">
                                    <span>Bởi: {viewDialog.report.comment?.user?.fullName}</span>
                                    {viewDialog.report.comment?.film && (
                                        <span>Phim: {viewDialog.report.comment.film.title}</span>
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
        </>
    );
}
