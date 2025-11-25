"use client";

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
import { useActorStore } from "@/stores/actorStore";
import { useDirectorStore } from "@/stores/directorStore";
import { useState } from "react";

interface DeleteActorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    actorId: string;
    actorName: string;
    isBulk?: boolean;
    onBulkDelete?: () => void;
}

export function DeleteActorDialog({
    open,
    onOpenChange,
    actorId,
    actorName,
    isBulk = false,
    onBulkDelete,
}: DeleteActorDialogProps) {
    const { deleteActor } = useActorStore();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            if (isBulk && onBulkDelete) {
                await onBulkDelete();
                onOpenChange(false);
            } else {
                const success = await deleteActor(parseInt(actorId));
                if (success) {
                    onOpenChange(false);
                }
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {isBulk ? (
                            <>
                                Hành động này không thể hoàn tác. Các diễn viên sau sẽ bị xóa vĩnh viễn khỏi hệ thống:<br />
                                <span className="font-semibold">{actorName}</span>
                            </>
                        ) : (
                            <>
                                Hành động này không thể hoàn tác. Diễn viên <span className="font-semibold">{actorName}</span> sẽ bị xóa vĩnh viễn khỏi hệ thống.
                            </>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isDeleting ? "Đang xóa..." : "Xóa"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
