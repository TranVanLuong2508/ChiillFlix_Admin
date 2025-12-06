"use client";

import { useState } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileText, Trash2, Eye, EyeOff, Copy } from "lucide-react";
import { CommentDialog } from "./comment-dialog";
import { DeleteCommentDialog } from "./delete-comment-dialog";
import { CommentColumn } from "@/types/comment.type";
import { useCommentStore } from "@/stores/commentStore";
import { toast } from "sonner";

interface ActionsProps {
    comment: CommentColumn;
}

export function Actions({ comment }: ActionsProps) {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [hardDeleteDialogOpen, setHardDeleteDialogOpen] = useState(false);
    const [confirmHideOpen, setConfirmHideOpen] = useState(false);
    const [isHiding, setIsHiding] = useState(false);
    const { toggleHideComment, hardDeleteComment } = useCommentStore();
    const [isHardDeleting, setIsHardDeleting] = useState(false);

    const handleToggleHide = async () => {
        setIsHiding(true);
        const success = await toggleHideComment(comment.commentId);
        setIsHiding(false);
        setConfirmHideOpen(false);
        if (success) {
            toast.success(
                comment.isHidden
                    ? "Bình luận đã được hiển thị"
                    : "Bình luận đã được ẩn"
            );
        } else {
            toast.error("Không thể thay đổi trạng thái bình luận");
        }
    };

    const handleHardDelete = async () => {
        setIsHardDeleting(true);
        const success = await hardDeleteComment(comment.commentId);
        setIsHardDeleting(false);
        setHardDeleteDialogOpen(false);
        if (success) {
            toast.success("Đã xóa vĩnh viễn bình luận");
        } else {
            toast.error("Không thể xóa bình luận");
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
                    <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => {
                            navigator.clipboard.writeText(comment.commentId);
                            toast.success("Đã sao chép ID");
                        }}
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Sao chép mã
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Xem Nội Dung Chi Tiết
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setConfirmHideOpen(true)}>
                        {comment.isHidden ? (
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
                        Xóa
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={confirmHideOpen} onOpenChange={setConfirmHideOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {comment.isHidden ? "Xác nhận hiển thị bình luận" : "Xác nhận ẩn bình luận"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {comment.isHidden
                                ? "Bạn có chắc chắn muốn hiển thị lại bình luận này?"
                                : "Bạn có chắc chắn muốn ẩn bình luận này? Người dùng sẽ nhận được thông báo khi bình luận bị ẩn."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isHiding}>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleToggleHide} disabled={isHiding} className={comment.isHidden ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}>
                            {isHiding
                                ? (comment.isHidden ? "Đang hiển thị..." : "Đang ẩn...")
                                : (comment.isHidden ? "Hiển thị" : "Ẩn")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <CommentDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                comment={comment}
                mode="view"
            />

            <DeleteCommentDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                commentId={comment.commentId}
                commentContent={comment.content}
            />

            <AlertDialog open={hardDeleteDialogOpen} onOpenChange={setHardDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600">
                            Xác nhận xóa bình luận
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-2">
                                <p>Bạn có chắc chắn muốn <strong className="text-red-600">XÓA</strong> bình luận này?</p>
                                <div className="p-3 bg-muted rounded-md">
                                    <p className="text-sm font-medium text-foreground line-clamp-3">
                                        "{comment.content}"
                                    </p>
                                </div>
                                <p className="text-red-600 font-bold">
                                    CẢNH BÁO: Hành động này sẽ xóa vĩnh viễn bình luận và TẤT CẢ bình luận con. Không thể khôi phục!
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
                            {isHardDeleting ? "Đang xóa..." : "Xóa"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
