"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import { Actions } from "./actions"
import { IPartColumn } from "@/types/part.type"

export const columns: ColumnDef<IPartColumn>[] = [
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
    accessorKey: "id",
    header: "ID",
    meta: {
      label: "ID",
    },
  },
  {
    accessorKey: "partNumber",
    header: "STT",
    meta: {
      label: "STT",
    },
  },
  {
    accessorKey: "title",
    header: "Tên phần",
    meta: {
      label: "Tên phần",
    },
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    meta: {
      label: "Mô tả",
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    meta: {
      label: "Ngày tạo",
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Ngày cập nhật",
    meta: {
      label: "Ngày cập nhật",
    },
  },
  {
    accessorKey: "filmId",
    header: "ID Phim",
    meta: {
      label: "ID Phim",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <Actions row={row.original} />
    },
  },
]