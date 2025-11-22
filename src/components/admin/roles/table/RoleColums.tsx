import { IRole } from "@/types/role.type";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const roleColumns = (onEdit: (id: number) => void, onDelete: (id: number) => void): ColumnDef<IRole>[] => [
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
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Trạng thái <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const active = Boolean(row.getValue("isActive"));
      return (
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${active ? "bg-green-500" : "bg-red-500"}`}></span>
          {active ? "Active" : "Inactive"}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Tạo <ArrowUpDown className="ml-2 h-4 w-4" />
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
        Chỉnh sửa <ArrowUpDown className="ml-2 h-4 w-4" />
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
