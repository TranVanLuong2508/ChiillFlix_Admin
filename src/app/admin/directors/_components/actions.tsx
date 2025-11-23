"use client";

import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Copy } from "lucide-react";
import { DirectorColumn } from "@/types/director.type";
import { DirectorDialog } from "./director-dialog";
import { DeleteDirectorDialog } from "./delete-director-dialog";

interface ActionsProps {
    director: DirectorColumn;
}

export function Actions({ director }: ActionsProps) {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
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
                            navigator.clipboard.writeText(director.directorId);
                        }}
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Sao chép mã
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setDeleteDialogOpen(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DirectorDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                director={director}
                mode="edit"
            />

            <DeleteDirectorDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                directorId={director.directorId}
                directorName={director.directorName}
            />
        </>
    );
}
