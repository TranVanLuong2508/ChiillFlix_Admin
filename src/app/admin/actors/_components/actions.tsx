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
import { ActorDialog } from "./actor-dialog";
import { DeleteActorDialog } from "./delete-actor-dialog";
import { ActorColumn } from "@/types/actor.type";

interface ActionsProps {
    actor: ActorColumn;
}

export function Actions({ actor }: ActionsProps) {
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
                            navigator.clipboard.writeText(actor.actorId);
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

            <ActorDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                actor={actor}
                mode="edit"
            />

            <DeleteActorDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                actorId={actor.actorId}
                actorName={actor.actorName}
            />
        </>
    );
}
