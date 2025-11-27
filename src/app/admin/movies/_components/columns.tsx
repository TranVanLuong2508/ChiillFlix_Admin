"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "../../../../components/table/data-table-column-header"
import { Actions } from "./actions"
import { FilmColumn } from "@/types/film.type"

export const columns: ColumnDef<FilmColumn>[] = [
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
    id: "actions",
    cell: ({ row }) => {
      return <Actions row={row.original} />
    },
  },
]

// export const columns: ColumnDef<Payment>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//   },
//   {
//     accessorKey: "email",
//     header: ({ column }) => {
//       return (
//         <DataTableColumnHeader column={column} title="Email" />
//       )
//     },
//   },
//   {
//     accessorKey: "amount",
//     header: () => <div className="text-right">Amount</div>,
//     cell: ({ row }) => {
//       const amount = parseFloat(row.getValue("amount"))
//       const formatted = new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "USD",
//       }).format(amount)

//       return <div className="text-right font-medium">{formatted}</div>
//     },
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const payment = row.original

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(payment.id)}
//             >
//               Copy payment ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>View customer</DropdownMenuItem>
//             <DropdownMenuItem>View payment details</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },
// ]
