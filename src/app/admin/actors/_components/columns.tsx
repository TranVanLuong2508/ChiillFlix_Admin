"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../../../../components/table-director/data-table-column-header";
import { Actions } from "./actions";
import { formatbirthDate, formatDateTime } from "@/utils/formateDate";
import { ActorColumn } from "@/types/actor.type";

export const columns: ColumnDef<ActorColumn>[] = [
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
    accessorKey: "actorId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã DV" />
    ),
    cell: ({ row }) => <div>{row.getValue("actorId")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "avatarUrl",
    header: "Ảnh",
    cell: ({ row }) => {
      const avatarUrl = row.getValue("avatarUrl") as string;
      const actorName = row.getValue("actorName") as string;
      return (
        <div className="flex items-center justify-center w-10 h-10">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={actorName}
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
    accessorKey: "actorName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên Diễn Viên" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("actorName")}</div>
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
    accessorKey: "shortBio",
    header: "Tiểu Sử",
    cell: ({ row }) => {
      const shortBio = row.getValue("shortBio") as string;
      return (
        <div className="max-w-xs truncate" title={shortBio}>
          {shortBio}
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
      const actor = row.original;
      return <Actions actor={actor} />;
    },
  },
];
