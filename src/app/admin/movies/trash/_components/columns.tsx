"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import { Actions } from "./actions"
import { FilmDeletedColumn, IUser_Film } from "@/types/film.type"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Copy } from "lucide-react"

export const columns: ColumnDef<FilmDeletedColumn>[] = [
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
    accessorKey: "filmId",
    header: "ID",
    meta: {
      label: "ID",
    },
  },
  {
    accessorKey: "title",
    header: "Tên phim",
    meta: {
      label: "Tên phim",
    },
  },
  {
    accessorKey: "originalTitle",
    header: "Tên gốc",
    meta: {
      label: "Tên gốc",
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
    accessorKey: "view",
    header: "Lượt xem",
    meta: {
      label: "Lượt xem",
    },
  },
  {
    accessorKey: "publicStatus",
    header: "Trạng thái",
    meta: {
      label: "Trạng thái",
    },
  },
  {
    accessorKey: "duration",
    header: "Thời gian (phút)",
    meta: {
      label: "Thời gian",
    },
    cell: ({ row }) => {
      return <div className="pl-10">{row.getValue("duration")}</div>;
    },
  },
  {
    accessorKey: "country",
    header: "Quốc gia",
    meta: {
      label: "Quốc gia",
    },
  },
  {
    accessorKey: "language",
    header: "Ngôn ngữ",
    meta: {
      label: "Ngôn ngữ",
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
    accessorKey: "deletedAt",
    header: "Ngày xóa",
    meta: {
      label: "Ngày xóa",
    },
  },
  {
    accessorKey: "deletedBy",
    header: "Người xóa",
    meta: {
      label: "Người xóa",
    },
    cell: ({ row }) => {
      const user: IUser_Film = row.getValue("deletedBy");
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="link" className="cursor-pointer">{user.fullName}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px]">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center text-xs justify-between">
                <div className="flex items-center">
                  <label>ID:</label>
                  <p className="text-sm font-medium pl-2">{user.userId}</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText((user.userId).toString());
                    toast.success("Đã sao chép ID người dùng")
                  }}
                  className="cursor-pointer p-2 hover:bg-gray-200/80 rounded-md"
                >
                  <Copy size={12} />
                </button>
              </div>
              <div className="flex items-center text-xs">
                <label>Họ tên:</label>
                <p className="text-sm font-medium pl-2">{user.fullName}</p>
              </div>
              <div className="flex items-center text-xs">
                <label>Số điện thoại:</label>
                <p className="text-sm font-medium pl-2">{user.phoneNumber}</p>
              </div>
              <div className="flex items-center text-xs">
                <label>Email:</label>
                <p className="text-sm font-medium pl-2">{user.email}</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <Actions row={row.original} />
    },
  },
]
