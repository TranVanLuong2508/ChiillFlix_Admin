"use client";

import * as React from "react";
import {
  ColumnDef,
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
import { ChevronDown, Settings2 } from "lucide-react";

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
import { IRole } from "@/types/role.type";
import { RoleService } from "@/services/roleService";
import { roleColumns } from "./table/RoleColums";
import { CreateRoleModal } from "./modals/CreateRoleModal";
import { DataTablePagination } from "@/components/table/data-table-pagination";

export function RolesTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [roleList, setRoleList] = React.useState<IRole[]>([]);
  const [openAddRoleModal, setOpenAddRoleModal] = React.useState(false);

  const handleEditRole = (roleId: number) => {
    console.log("Edit role", roleId);
  };

  const handleDeleteRole = (roleId: number) => {
    console.log("Delete role", roleId);
  };

  const table = useReactTable({
    data: roleList,
    columns: roleColumns(handleEditRole, handleDeleteRole),
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
    fetchRoleData();
  }, []);

  const fetchRoleData = async () => {
    try {
      const res = await RoleService.CallFetchRolesList();
      if (res?.EC === 1 && res.data?.roles) {
        setRoleList(res.data.roles);
      }
    } catch (error) {
      console.log("Error loading roles:", error);
    }
  };
  const fetchRoleDataReverse = async () => {
    try {
      const res = await RoleService.CallFetchRolesList();
      if (res?.EC === 1 && res.data?.roles) {
        setRoleList(res.data.roles.reverse());
      }
    } catch (error) {
      console.log("Error loading roles:", error);
    }
  };

  const handleOpenModal = () => {
    setOpenAddRoleModal(true);
  };

  const handleCloseModal = () => {
    setOpenAddRoleModal(false);
  };

  return (
    <>
      <div className="w-full space-y-4">
        <div className="flex items-center py-4 gap-3">
          <Input
            placeholder="Tìm theo tên vai trò..."
            value={(table.getColumn("roleName")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("roleName")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />

          <Button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-all duration-300"
          >
            + Thêm vai trò
          </Button>

          <DropdownMenu>
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
                    roleId: "ID",
                    roleName: "Tên Vai trò",
                    directorName: "Tên Đạo Diễn",
                    description: "Mô tả",
                    isActive: "Trạng thái",
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
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={roleColumns.length} className="h-24 text-center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>
      <CreateRoleModal open={openAddRoleModal} onClose={handleCloseModal} onSuccess={() => fetchRoleDataReverse()} />
    </>
  );
}
