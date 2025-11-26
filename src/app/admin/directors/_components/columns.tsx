"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../../../../components/table-director/data-table-column-header";
import { Actions } from "./actions";
import { DirectorColumn } from "@/types/director.type";
import { formatbirthDate, formatDate, formatDateTime } from "@/utils/formateDate";

export const columns: ColumnDef<DirectorColumn>[] = [
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
    accessorKey: "directorId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã ĐD" />
    ),
    cell: ({ row }) => <div>{row.getValue("directorId")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "avatarUrl",
    header: "Ảnh",
    cell: ({ row }) => {
      const avatarUrl = row.getValue("avatarUrl") as string;
      const directorName = row.getValue("directorName") as string;
      return (
        <div className="flex items-center justify-center h-10 w-10">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={directorName}
              width={40}
              height={40}
              className="rounded-full object-cover w-10 h-10"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-500">N/A</span>
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "directorName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên Đạo Diễn" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("directorName")}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "slug",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Slug" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("slug")}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "birthDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày Sinh" />
    ),
    cell: ({ row }) => <div>{formatbirthDate(row.getValue("birthDate"))}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Giới Tính" />
    ),
    cell: ({ row }) => <div>{row.getValue("gender")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "nationality",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quốc Tịch" />
    ),
    cell: ({ row }) => <div>{row.getValue("nationality")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "story",
    header: "Tiểu Sử",
    cell: ({ row }) => {
      const story = row.getValue("story") as string;
      return (
        <div className="max-w-xs truncate" title={story}>
          {story}
        </div>
      );
    },
    enableSorting: false,
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
      const director = row.original;
      return <Actions director={director} />;
    },
  },
];
