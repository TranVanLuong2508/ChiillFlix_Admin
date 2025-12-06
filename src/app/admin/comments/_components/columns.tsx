"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../../../../components/table-comment/data-table-column-header";
import { Actions } from "./actions";
import { formatDateTime } from "@/utils/formateDate";
import { CommentColumn } from "@/types/comment.type";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";

export const columns: ColumnDef<CommentColumn>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "commentId",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Mã BL" />
        ),
        cell: ({ row }) => {
            const id = row.getValue("commentId") as string;
            return <div className="font-mono text-xs">{id.substring(0, 8)}...</div>;
        },
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "userAvatar",
        header: "Người dùng",
        cell: ({ row }) => {
            const avatarUrl = row.getValue("userAvatar") as string;
            const userName = row.getValue("userName") as string;
            return (
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={userName}
                                width={32}
                                height={32}
                                className="rounded-full object-cover w-8 h-8"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-500">?</span>
                            </div>
                        )}
                    </div>
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "userName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tên Người Dùng" />
        ),
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("userName")}</div>
        ),
        enableSorting: true,
    },
    {
        accessorKey: "content",
        header: "Nội dung",
        cell: ({ row }) => {
            const content = row.getValue("content") as string;
            return (
                <div className="max-w-md truncate" title={content}>
                    {content}
                </div>
            );
        },
        enableSorting: false,
    },
    {
        accessorKey: "filmTitle",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Phim" />
        ),
        cell: ({ row }) => {
            const filmTitle = row.getValue("filmTitle") as string;
            return (
                <div className="max-w-xs truncate" title={filmTitle}>
                    {filmTitle}
                </div>
            );
        },
        enableSorting: true,
    },
    {
        accessorKey: "isHidden",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Trạng thái" />
        ),
        cell: ({ row }) => {
            const isHidden = row.getValue("isHidden") as boolean;
            return isHidden ? (
                <Badge variant="secondary" className="gap-1">
                    <EyeOff className="h-3 w-3" />
                    Ẩn
                </Badge>
            ) : (
                <Badge variant="default" className="gap-1 bg-green-600">
                    <Eye className="h-3 w-3" />
                    Hiển thị
                </Badge>
            );
        },
        enableSorting: true,
    },
    {
        accessorKey: "totalLike",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Thích" />
        ),
        cell: ({ row }) => {
            const totalLike = row.getValue("totalLike") as number;
            return (
                <div className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3 text-blue-500" />
                    <span>{totalLike}</span>
                </div>
            );
        },
        enableSorting: true,
    },
    {
        accessorKey: "totalDislike",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Không thích" />
        ),
        cell: ({ row }) => {
            const totalDislike = row.getValue("totalDislike") as number;
            return (
                <div className="flex items-center gap-1">
                    <ThumbsDown className="h-3 w-3 text-red-500" />
                    <span>{totalDislike}</span>
                </div>
            );
        },
        enableSorting: true,
    },
    {
        accessorKey: "totalChildrenComment",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Trả lời" />
        ),
        cell: ({ row }) => {
            const totalChildrenComment = row.getValue("totalChildrenComment") as number;
            return (
                <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3 text-gray-500" />
                    <span>{totalChildrenComment}</span>
                </div>
            );
        },
        enableSorting: true,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Ngày Tạo" />
        ),
        cell: ({ row }) => <div>{formatDateTime(row.getValue("createdAt"))}</div>,
        enableSorting: true,
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Ngày Chỉnh Sửa" />
        ),
        cell: ({ row }) => <div>{formatDateTime(row.getValue("updatedAt"))}</div>,
        enableSorting: true,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const comment = row.original;
            return <Actions comment={comment} />;
        },
    },
];
