"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { filteType, IReturnRole, IRole } from "@/types/role.type";
import { RoleService } from "@/services/roleService";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { DropdownFilter } from "@/components/admin/roles/DropdownFilter";
import { toast } from "sonner";
import { UserColumns } from "./UserColumn";
import UserService from "@/services/userService";
import { IUserBasic } from "@/types/user.type";

export function UserTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [userList, setUserLIst] = React.useState<IUserBasic[]>([]);

  const [statusFilter, setStatusFilter] = React.useState<filteType>("all");

  const handleEditUser = (userId: number) => {
    console.log("EDIT USER: ", userId);
  };

  const handleDeleteUser = async (userId: number) => {
    console.log("DELTE USER: ", userId);
  };

  const table = useReactTable({
    data: userList,
    columns: UserColumns(handleEditUser, handleDeleteUser),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  React.useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await UserService.CallGetAllUserList();
      if (res?.EC === 1 && res.data?.users) {
        setUserLIst(res.data.users);
      }
    } catch (error) {
      console.log("Error loading roles:", error);
    }
  };

  console.log("Check userList: ", userList);

  return (
    <>
      <div className="w-full space-y-4">
        <div className="flex items-center py-4 gap-3">
          <Input
            placeholder="Tìm theo tên người dùng..."
            value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("fullName")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />

          <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-all duration-300">
            + Thêm User
          </Button>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto cursor-pointer">
                <Settings2 /> Xem
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Chuyển đổi cột</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const columnNames: Record<string, string> = {
                    userId: "ID",
                    fullName: "Tên",
                    email: "Email",
                    isVip: "VIP",
                    genderCode: "Giới tính",
                    createdAt: "Ngày tạo",
                    updatedAt: "Ngày chỉnh sửa",
                  };
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize cursor-pointer"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {columnNames[column.id]}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => {
                  return (
                    <TableRow key={row.id} className={"bg-white"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={UserColumns.length} className="h-24 text-center ">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>
    </>
  );
}
