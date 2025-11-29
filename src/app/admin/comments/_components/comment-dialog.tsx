"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CommentColumn } from "@/types/comment.type";
import "@/styles/hideScroll.css";

interface CommentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    comment?: CommentColumn | null;
    mode: "view";
}

interface CommentFormData {
    content: string;
}

export function CommentDialog({
    open,
    onOpenChange,
    comment,
}: CommentDialogProps) {
    const {
        register,
        reset,
    } = useForm<CommentFormData>({
        defaultValues: {
            content: "",
        },
    });

    useEffect(() => {
        if (comment) {
            reset({
                content: comment.content,
            });
        } else {
            reset({
                content: "",
            });
        }
    }, [comment, reset]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto hide-scrollbar">
                <DialogHeader>
                    <DialogTitle>Xem Nội Dung Bình Luận</DialogTitle>
                    <DialogDescription>
                        Chi tiết nội dung bình luận của người dùng
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="content">
                            Nội dung
                        </Label>
                        <Textarea
                            id="content"
                            {...register("content")}
                            rows={6}
                            disabled={true}
                            className="resize-none bg-gray-50 cursor-not-allowed break-all overflow-y-auto"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Đóng
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
