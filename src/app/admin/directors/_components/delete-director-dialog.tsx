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
import { useDirectorStore } from "@/stores/directorStore";
import { useState } from "react";

interface DeleteDirectorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    directorId: string;
    directorName: string;
    isBulk?: boolean;
    onBulkDelete?: () => void;
}

export function DeleteDirectorDialog({
    open,
    onOpenChange,
    directorId,
    directorName,
    isBulk = false,
    onBulkDelete,
}: DeleteDirectorDialogProps) {
    const { deleteDirector } = useDirectorStore();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            if (isBulk && onBulkDelete) {
                await onBulkDelete();
                onOpenChange(false);
            } else {
                const success = await deleteDirector(parseInt(directorId));
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
                                Hành động này không thể hoàn tác. Các đạo diễn sau sẽ bị xóa vĩnh viễn khỏi hệ thống:<br />
                                <span className="font-semibold">{directorName}</span>
                            </>
                        ) : (
                            <>
                                Hành động này không thể hoàn tác. Đạo diễn <span className="font-semibold">{directorName}</span> sẽ bị xóa vĩnh viễn khỏi hệ thống.
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
