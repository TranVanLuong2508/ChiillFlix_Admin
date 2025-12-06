"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import { Actions } from "./actions"
import { FilmColumn } from "@/types/film.type"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import FilmService from "@/services/film.service"
import { toast } from "sonner"

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
    accessorKey: "isVip",
    header: "VIP",
    meta: {
      label: "VIP",
    },
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const filmId = row.getValue("filmId");
      const [isVip, setIsVip] = useState<boolean>(row.getValue("isVip"));

      const handleChangeVIP = async () => {
        if (!filmId) {
          setOpen(false);
          return;
        }
        try {
          const res = await FilmService.updateFilm(filmId as string, { isVip: !row.getValue("isVip") });

          if (res.EC === 0 && res.data) {
            toast.success("Cập nhật trạng thái thành công");
            setIsVip(!isVip);
          } else {
            toast.error("Cập nhật trạng thái thất bại");
          }

        } catch (error) {
          console.log("Error Change VIP: ", filmId, " - ", error);
          toast.error("Cập nhật trạng thái thất bại");
        }
        setOpen(false);
      }

      return (
        <>
          <Checkbox
            id={row.getValue("filmId")}
            className="border border-zinc-800 data-[state=checked]:bg-transparent data-[state=checked]:text-amber-500 size-5"
            checked={isVip}
            onCheckedChange={() => setOpen(true)}
          />
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận thay đổi trạng thái VIP</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn thay đổi trạng thái VIP cho phim này không?
                </AlertDialogDescription>
                <div className="text-sm">
                  <div className="flex items-center gap-2">
                    <h2 className=" text-gray-800">Phim: </h2>
                    <p className=" text-amber-500 font-semibold">{row.getValue("title")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <h2 className=" text-gray-800">Tên gốc: </h2>
                    <p className=" text-amber-500 font-semibold">{row.getValue("originalTitle")}</p>
                  </div>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">Hủy</AlertDialogCancel>
                <AlertDialogAction
                  className="cursor-pointer"
                  onClick={handleChangeVIP}
                >
                  Đồng ý
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )
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
