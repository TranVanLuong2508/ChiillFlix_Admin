"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, RotateCcw, Eye, EyeOff, Copy } from "lucide-react";
import { RatingColumn } from "@/types/rating.type";
import { useRatingStore } from "@/stores/ratingStore";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface ActionsProps {
    rating: RatingColumn;
}

export function Actions({ rating }: ActionsProps) {
    const { deleteRating, restoreRating, hideRating, unhideRating, hardDeleteRating } = useRatingStore();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
    const [confirmHideOpen, setConfirmHideOpen] = useState(false);
    const [hardDeleteDialogOpen, setHardDeleteDialogOpen] = useState(false);
    const [isHiding, setIsHiding] = useState(false);
    const [isHardDeleting, setIsHardDeleting] = useState(false);

    const handleDelete = async () => {
        const success = await deleteRating(rating.ratingId);
        if (success) {
            toast.success("Xóa đánh giá thành công");
        } else {
            toast.error("Không thể xóa đánh giá");
        }
        setDeleteDialogOpen(false);
    };

    const handleRestore = async () => {
        const success = await restoreRating(rating.ratingId);
        if (success) {
            toast.success("Khôi phục đánh giá thành công");
        } else {
            toast.error("Không thể khôi phục đánh giá");
        }
        setRestoreDialogOpen(false);
    };

    const handleToggleHide = async () => {
        setIsHiding(true);
        const success = rating.isHidden
            ? await unhideRating(rating.ratingId)
            : await hideRating(rating.ratingId);
        setIsHiding(false);
        setConfirmHideOpen(false);
        if (success) {
            toast.success(
                rating.isHidden
                    ? "Đánh giá đã được hiển thị"
                    : "Đánh giá đã được ẩn"
            );
        } else {
            toast.error("Không thể thay đổi trạng thái đánh giá");
        }
    };

    const handleHardDelete = async () => {
        setIsHardDeleting(true);
        const success = await hardDeleteRating(rating.ratingId);
        setIsHardDeleting(false);
        setHardDeleteDialogOpen(false);
        if (success) {
            toast.success("Đã xóa vĩnh viễn đánh giá");
        } else {
            toast.error("Không thể xóa đánh giá");
        }
    };

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => {
                            navigator.clipboard.writeText(rating.ratingId);
                            toast.success("Đã sao chép ID");
                        }}
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Sao chép mã
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setConfirmHideOpen(true)}>
                        {rating.isHidden ? (
                            <>
                                <Eye className="mr-2 h-4 w-4" />
                                Hiển thị
                            </>
                        ) : (
                            <>
                                <EyeOff className="mr-2 h-4 w-4" />
                                Ẩn
                            </>
                        )}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="text-red-600 font-semibold"
                        onClick={() => setHardDeleteDialogOpen(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                        Xóa vĩnh viễn
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={confirmHideOpen} onOpenChange={setConfirmHideOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {rating.isHidden ? "Xác nhận hiển thị đánh giá" : "Xác nhận ẩn đánh giá"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {rating.isHidden
                                ? "Bạn có chắc chắn muốn hiển thị lại đánh giá này?"
                                : "Bạn có chắc chắn muốn ẩn đánh giá này?"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isHiding}>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleToggleHide}
                            disabled={isHiding}
                            className={rating.isHidden ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                        >
                            {isHiding
                                ? (rating.isHidden ? "Đang hiển thị..." : "Đang ẩn...")
                                : (rating.isHidden ? "Hiển thị" : "Ẩn")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc muốn xóa đánh giá này? Hành động này có thể được hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận khôi phục</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc muốn khôi phục đánh giá này?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRestore} className="bg-green-600 hover:bg-green-700">
                            Khôi phục
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Hard Delete Dialog */}
            <AlertDialog open={hardDeleteDialogOpen} onOpenChange={setHardDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600">
                            Xác nhận xóa vĩnh viễn đánh giá
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-2">
                                <p>Bạn có chắc chắn muốn <strong className="text-red-600">XÓA VĨNH VIỄN</strong> đánh giá này?</p>
                                <div className="p-3 bg-muted rounded-md">
                                    <p className="text-sm font-medium text-foreground">
                                        Đánh giá: {rating.ratingValue} ⭐
                                    </p>
                                    {rating.content && (
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                            "{rating.content}"
                                        </p>
                                    )}
                                </div>
                                <p className="text-red-600 font-bold">
                                    CẢNH BÁO: Hành động này sẽ xóa vĩnh viễn đánh giá. Không thể khôi phục!
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isHardDeleting}>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleHardDelete}
                            disabled={isHardDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isHardDeleting ? "Đang xóa..." : "Xóa vĩnh viễn"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
