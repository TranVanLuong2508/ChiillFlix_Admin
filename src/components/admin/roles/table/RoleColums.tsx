import { IRole } from "@/types/role.type";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import * as dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const roleColumns = (onEdit: (id: number) => void, onDelete: (id: number) => void): ColumnDef<IRole>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 10,
  },
  {
    accessorKey: "roleId",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        ID <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "roleName",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Tên vai trò <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Mô tả <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="line-clamp-2 max-w-[300px]">{row.getValue("description")}</div>,
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <div className="w-full flex justify-center">
        <Button variant="ghost">Trạng thái</Button>
      </div>
    ),
    cell: ({ row }) => {
      const active = Boolean(row.getValue("isActive"));

      return (
        <div className="flex justify-center">
          <span
            className={`
            inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium
            border
            ${active ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}
          `}
          >
            {active ? "Active" : "Inactive"}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Ngày tạo <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div>{date.toLocaleString("vi-VN")}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Ngày chỉnh sửa <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      return <div>{date.toLocaleString("vi-VN")}</div>;
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const role = row.original;
      return (
        <div className="flex gap-2">
          <button
            onClick={() => {
              onEdit(role.roleId);
            }}
            className="text-blue-500 cursor-pointer"
          >
            {" "}
            <SquarePen className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              onDelete(role.roleId);
            }}
            className="text-red-500 cursor-pointer "
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      );
    },
  },
];
