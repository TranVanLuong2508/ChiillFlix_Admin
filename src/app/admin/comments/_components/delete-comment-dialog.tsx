"use client";

import { useState } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useCommentStore } from "@/stores/commentStore";
import { toast } from "sonner";

interface DeleteCommentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    commentId: string;
    commentContent: string;
    isBulk?: boolean;
    onBulkDelete?: () => Promise<void>;
}

export function DeleteCommentDialog({
    open,
    onOpenChange,
    commentId,
    commentContent,
    isBulk = false,
    onBulkDelete,
}: DeleteCommentDialogProps) {
    const { deleteComment } = useCommentStore();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            if (isBulk && onBulkDelete) {
                await onBulkDelete();
                toast.success("Xóa các bình luận thành công!");
                onOpenChange(false);
            } else {
                const success = await deleteComment(commentId);
                if (success) {
                    toast.success("Xóa bình luận thành công!");
                    onOpenChange(false);
                } else {
                    toast.error("Xóa bình luận thất bại!");
                }
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra!");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {isBulk ? "Xác nhận xóa bình luận" : "Xác nhận xóa bình luận"}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                        <p>
                            {isBulk
                                ? "Bạn có chắc chắn muốn xóa các bình luận đã chọn?"
                                : "Bạn có chắc chắn muốn xóa bình luận này?"}
                        </p>
                        {!isBulk && (
                            <div className="p-3 bg-muted rounded-md">
                                <p className="text-sm font-medium text-foreground line-clamp-3">
                                    "{commentContent}"
                                </p>
                            </div>
                        )}
                        <p className="text-red-600 font-medium">
                            Hành động này không thể hoàn tác.
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Đang xóa..." : "Xóa"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
