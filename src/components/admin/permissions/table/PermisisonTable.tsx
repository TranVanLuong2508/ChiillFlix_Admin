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
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { DropdownFilter } from "@/components/admin/roles/DropdownFilter";
import { toast } from "sonner";
import { permisionColumns } from "./PermissionsColumns";
import { IPermissionn } from "@/types/permission.type";
import { PermmissionService } from "@/services/permissionService";
import "../../../../styles/HideScrollBar.css";

export function PermissionsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [permissionList, setPermissionList] = React.useState<IPermissionn[]>([]);
  const [originalPermissions, setOriginalPermissions] = React.useState<IPermissionn[]>([]);

  const [openAddPermisisonModal, setOpenAddPermisisonModal] = React.useState(false);
  const [openEditPermisisonModal, setOpenEditPermisisonModal] = React.useState(false);
  const [openRestorePermisisonModal, setOpenRestorePermissionModal] = React.useState(false);

  const [editingPermissionId, setEditingPermissionId] = React.useState<number | null>(null);
  const [deletingPermission, setDeletingPermission] = React.useState<IPermissionn | null>(null);
  const [restoringPermission, setRestoringPermission] = React.useState<IPermissionn | null>(null);
  //   const [statusFilter, setStatusFilter] = React.useState<filteType>("all");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);

  const handleEditPermisison = (roleId: number) => {
    // setEditingRoleId(roleId);
    // setOpenEditRoleModal(true);
  };

  const handleDeletePermission = async (roleId: number) => {
    try {
      //   const per = roleList.find((r) => r.roleId === roleId) || null;
      //   setDeletingRole(role);
      //   const res = await RoleService.CallCheckRoleBeforeDelete(roleId);
      //   console.log("Check res CallCheckRoleBeforeDelete: ", res);
      //   if (res?.EC === 1 && res.data) {
      //     setConfirmDeleteOpen(true);
      //   } else if (res?.EC === 0) {
      //     toast.error("Không thể xoá vai trò");
      //   }
    } catch (error) {
      console.error("Error check delete role:", error);
      toast.error("Lỗi khi kiểm tra vai trò trước khi xoá");
    }
  };

  const handleRestorePermison = async (roleId: number) => {
    try {
      //   const role = roleList.find((r) => r.roleId === roleId) || null;
      //   setRestoringPermission(role);
      //   const res = await RoleService.CallRestoreRole(roleId);
      //   console.log("Check res CallCheckRoleBeforeDelete: ", res);
      //   if (res?.EC === 1 && res.data) {
      //     toast.success(`khôi mục ROLE: ${res.data.roleName} `);
      //     fetchRoleData();
      //   } else {
      //     toast.success(`khôi mục vai trò thất bại`);
      //   }
    } catch (error) {
      console.error("Error restore role:", error);
      toast.error("Lỗi khi khôi phục vai trò");
    }
  };

  const table = useReactTable({
    data: permissionList,
    columns: permisionColumns(handleEditPermisison, handleDeletePermission, handleRestorePermison),
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
    fetchPermisisonData();
  }, []);

  const fetchPermisisonData = async () => {
    try {
      const res = await PermmissionService.CallFetchPermissionList();
      if (res?.EC === 1 && res.data?.permissions) {
        setPermissionList(res.data.permissions);
      }
    } catch (error) {
      console.log("Error loading permissions:", error);
    }
  };

  //   React.useEffect(() => {
  //     applyFilter(statusFilter);
  //   }, [statusFilter, originalRoles]);

  //   const fetchRoleDataToTop = async (roleId: number) => {
  //     try {
  //       const res = await RoleService.CallFetchRolesList();

  //       if (res?.EC === 1 && res.data?.roles) {
  //         const roles = res.data.roles;
  //         const updatedRole = roles.find((r) => r.roleId === roleId);

  //         if (!updatedRole) {
  //           setOriginalRoles(roles);
  //           setRoleList(roles);
  //           return;
  //         }

  //         const newList = [updatedRole, ...roles.filter((r) => r.roleId !== roleId)];

  //         setOriginalRoles(newList);
  //         setRoleList(newList);
  //       }
  //     } catch (error) {
  //       console.log("Error fetch role data to top:", error);
  //     }
  //   };

  const handleOpenCreateModal = () => {
    setOpenAddPermisisonModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenAddPermisisonModal(false);
  };

  const handleOpenEditModal = () => {
    setOpenEditPermisisonModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditPermisisonModal(false);
  };

  //   const applyFilter = (status: filteType) => {
  //     setStatusFilter(status);

  //     if (status === "all") {
  //       setRoleList(originalRoles);
  //       return;
  //     }

  //     if (status === "active") {
  //       setRoleList(originalRoles.filter((role) => !role.isDeleted));
  //       return;
  //     }

  //     if (status === "deleted") {
  //       setRoleList(originalRoles.filter((role) => role.isDeleted));
  //       return;
  //     }
  //   };

  console.log("Check roleList: ", permissionList);

  return (
    <>
      <div className="w-full space-y-4">
        <div className="flex items-center py-4 gap-3">
          <Input
            placeholder="Tìm theo tên quyền hạn..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <Button
            onClick={() => handleOpenCreateModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-all duration-300"
          >
            + Thêm quyền hạn
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
                    permissionId: "ID",
                    name: "Tên quyền hạn",
                    apiPath: "Api Path",
                    method: "Method",
                    module: "Module",
                    // isDeleted: "Trạng thái xóa",
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
                  const deleted = row.original.isDeleted;

                  return (
                    <TableRow
                      key={row.id}
                      className={row.original.isDeleted ? "bg-gray-200 opacity-50 hover:bg-gray-200" : "bg-white"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={permisionColumns.length} className="h-24 text-center ">
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
