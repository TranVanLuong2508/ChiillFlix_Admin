"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ConfirmDeleteUserModalProps {
    open: boolean;
    onClose: () => void;
    onDeleted: () => void;

    userId: number | null;
    userName?: string;
    userEmail?: string;

    onDeleteUser: () => Promise<void>;
}

export function ConfirmDeleteUserModal({
    open,
    onClose,
    onDeleted,
    userId,
    userName,
    userEmail,
    onDeleteUser,
}: ConfirmDeleteUserModalProps) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            await onDeleteUser();
            onDeleted();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Xác nhận xoá người dùng
                    </DialogTitle>
                    <DialogDescription>
                        <span>
                            Bạn có chắc muốn xoá người dùng <b>{userName}</b> ({userEmail}) không? Thao tác này là Soft Delete, có thể khôi phục lại.
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Huỷ
                    </Button>
                    <Button
                        className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : "Xoá"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
