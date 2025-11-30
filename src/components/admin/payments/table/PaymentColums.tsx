import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateTime } from "@/utils/formateDate";
import { IPayment } from "@/types/payment.type";

export const PaymentColumns = (onEdit: (id: string) => void, onDelete: (id: string) => void): ColumnDef<IPayment>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px] cursor-pointer"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px] cursor-pointer"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 10,
  },
  {
    accessorKey: "paymentId",
    header: ({ column }) => (
      <Button
        className="cursor-pointer"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Payment ID <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  {
    id: "userName",
    accessorFn: (row) => row.user.fullName, // value để filter
    header: () => null,
    cell: () => null,
    enableHiding: true, // không hiển thị
  },

  {
    accessorKey: "user",
    header: () => <div className="">Người dùng</div>,
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-medium">{user.fullName}</span>
            {/* <span className="text-xs text-muted-foreground">{user.email}</span> */}
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "plan",
    header: () => <div className="">Gói VIP</div>,
    cell: ({ row }) => {
      const plan = row.original.plan;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{plan.planName}</span>
          {/* <span className="text-xs text-muted-foreground">
            {plan.planDuration} {plan.durationTypeCode}
          </span> */}
        </div>
      );
    },
  },

  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Số tiền (VND)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = Number(row.getValue("amount"));
      return <span>{amount.toLocaleString("vi-VN")} ₫</span>;
    },
  },

  {
    accessorKey: "status",
    header: () => <div className="text-center">Trạng thái</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const style =
        status === "SUCCESS"
          ? "bg-green-100 text-green-800 border-green-300"
          : status === "FAILED"
            ? "bg-red-100 text-red-800 border-red-300"
            : "bg-yellow-100 text-yellow-800 border-yellow-300";

      return (
        <div className="flex justify-center">
          <span className={`px-2 py-1 rounded-md border text-xs font-medium ${style}`}>{status}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "paymentMethod",
    header: () => <div>Phương thức</div>,
    cell: ({ row }) => <span>{row.getValue("paymentMethod")}</span>,
  },

  {
    accessorKey: "vnpayBankCode",
    header: () => <div>Ngân hàng</div>,
  },
  {
    accessorKey: "vnpayResponseCode",
    header: () => <div>Mã phản hồi</div>,
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Thời gian tạo
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{formatDateTime(row.getValue("createdAt"))}</div>,
  },

  // MENU
  {
    id: "menu",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.paymentId)}
              className="cursor-pointer"
            >
              Copy Mã Giao Dịch
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.user.email)}>
              Copy Email Người Dùng
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(payment.paymentId)}>Chỉnh sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(payment.paymentId)}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
