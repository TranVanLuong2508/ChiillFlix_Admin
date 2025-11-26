"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import { Actions } from "./actions"
import { IEpisodeColumn } from "@/types/episode.type"

export const columns: ColumnDef<IEpisodeColumn>[] = [
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
    accessorKey: "episodeNumber",
    header: "STT",
    meta: {
      label: "STT",
    },
  },
  {
    accessorKey: "title",
    header: "Tên tập",
    meta: {
      label: "Tên tập",
    },
  },
  {
    accessorKey: "slug",
    header: "Slug",
    meta: {
      label: "Slug",
    },
  },
  {
    accessorKey: "duration",
    header: "Thời lượng (phút)",
    meta: {
      label: "Thời lượng",
    },
  },
  {
    accessorKey: "videoUrl",
    header: "Video URL",
    meta: {
      label: "Video URL",
    },
  },
  {
    accessorKey: "thumbUrl",
    header: "Thumbnail URL",
    meta: {
      label: "Thumbnail URL",
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
    accessorKey: "partId",
    header: "Id phần",
    meta: {
      label: "Id phần",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <Actions row={row.original} />
    },
  },
]