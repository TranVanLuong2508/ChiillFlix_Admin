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
import { IUser, IUserBasic } from "@/types/user.type";

const valueGender: Record<string, string> = {
  O: "Khác",
  F: "Nữ",
  M: "Nam",
};

export const UserColumns = (onEdit: (id: number) => void, onDelete: (id: number) => void): ColumnDef<IUserBasic>[] => [
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
    accessorKey: "userId",
    header: ({ column }) => (
      <Button
        className="cursor-pointer"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ID <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <Button
        className="cursor-pointer"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tên <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        className="cursor-pointer"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        email <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="line-clamp-2 max-w-[300px]">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "genderCode",
    header: ({ column }) => (
      <Button
        className="cursor-pointer"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Giới tính <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const gender = row.original;
      const value = String(row.getValue("genderCode"));
      let genderValue = "";
      if (value) {
        genderValue = valueGender[value];
      } else {
        genderValue = "Chưa thêm";
      }
      return <div className="line-clamp-2 max-w-[300px]">{genderValue}</div>;
    },
  },

  {
    accessorKey: "isVip",
    header: ({ column }) => (
      <div className="w-full flex justify-center ">
        <Button variant="ghost">VIP ?</Button>
      </div>
    ),
    cell: ({ row }) => {
      const isVip = Boolean(row.getValue("isVip"));

      return (
        <div className="flex justify-center">
          <span
            className={`
            inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium
            border
            ${isVip ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}
          `}
          >
            {isVip ? "VIP" : "Free member"}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        className="cursor-pointer"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Ngày tạo <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <div>{formatDateTime(row.getValue("createdAt"))}</div>;
    },
  },

  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <Button
        className="cursor-pointer"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Ngày chỉnh sửa <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <div>{formatDateTime(row.getValue("updatedAt"))}</div>;
    },
  },
  {
    id: "menu",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0  cursor-pointer">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigator.clipboard.writeText(user.email.toString())}
            >
              Copy Email
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(user.userId)}>
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => onDelete(user.userId)}>
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
