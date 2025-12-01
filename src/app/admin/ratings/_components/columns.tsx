"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../../../../components/table-rating/data-table-column-header";
import { Actions } from "./actions";
import { formatDateTime } from "@/utils/formateDate";
import { RatingColumn } from "@/types/rating.type";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Star } from "lucide-react";

export const columns: ColumnDef<RatingColumn>[] = [
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
        accessorKey: "ratingId",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Mã ĐG" />
        ),
        cell: ({ row }) => {
            const id = row.getValue("ratingId") as string;
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
        accessorKey: "ratingValue",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Đánh giá" />
        ),
        cell: ({ row }) => {
            const value = row.getValue("ratingValue") as number;
            return (
                <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{value.toFixed(1)}</span>
                </div>
            );
        },
        enableSorting: true,
    },
    {
        accessorKey: "content",
        header: "Nội dung",
        cell: ({ row }) => {
            const content = row.getValue("content") as string;
            return (
                <div className="max-w-md truncate" title={content}>
                    {content || <span className="text-gray-400 italic">Không có nội dung</span>}
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
            <DataTableColumnHeader column={column} title="Hiển thị" />
        ),
        cell: ({ row }) => {
            const isHidden = row.getValue("isHidden") as boolean;
            return isHidden ? (
                <Badge variant="secondary">
                    <EyeOff className="mr-1 h-4 w-4" />
                    Ẩn
                </Badge>
            ) : (
                <Badge variant="default" className="bg-green-600">
                    <Eye className="mr-1 h-4 w-4" />
                    Hiển thị</Badge>
            );
        },
        enableSorting: true,
    },
    // {
    //     accessorKey: "deletedAt",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Trạng thái" />
    //     ),
    //     cell: ({ row }) => {
    //         const deletedAt = row.getValue("deletedAt") as Date | undefined;
    //         return deletedAt ? (
    //             <Badge variant="destructive">Đã xóa</Badge>
    //         ) : (
    //             <Badge variant="default" className="bg-blue-600">Hoạt động</Badge>
    //         );
    //     },
    //     enableSorting: true,
    // },
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
            <DataTableColumnHeader column={column} title="Ngày Cập Nhật" />
        ),
        cell: ({ row }) => <div>{formatDateTime(row.getValue("updatedAt"))}</div>,
        enableSorting: true,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const rating = row.original;
            return <Actions rating={rating} />;
        },
    },
];
