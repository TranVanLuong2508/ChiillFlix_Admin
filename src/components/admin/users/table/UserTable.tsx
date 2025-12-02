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
import { toast } from "sonner";
import { UserColumns } from "./UserColumn";
import UserService from "@/services/userService";
import { IUserBasic } from "@/types/user.type";
import { CreateUserModal } from "../modal/CreateUserModal";
import { allCodeService } from "@/services/allCodeService";
import { AllCodeRow } from "@/types/backend.type";
import { RoleService } from "@/services/roleService";
import { IRole } from "@/types/role.type";
import { EditUserModal } from "../modal/EditUserModal";
import { ConfirmDeleteUserModal } from "../modal/ConfirmDeleteUserModal";

export function UserTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [deletingUser, setDeletingUser] = React.useState<IUserBasic | null>(null);
  const [genderList, setGenderList] = React.useState<AllCodeRow[]>([]);
  const [roleList, setRoleList] = React.useState<IRole[]>([]);
  const [editingUser, setEditingUser] = React.useState<IUserBasic | null>(null);
  const [userList, setUserLIst] = React.useState<IUserBasic[]>([]);

  const handleEditUser = (userId: number) => {
    const user = userList.find(u => u.userId === userId);
    if (user) {
      setEditingUser(user);
      setOpenEditModal(true);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    const user = userList.find(u => u.userId === userId);
    if (user) {
      setDeletingUser(user);
      setOpenDeleteModal(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    try {
      const res = await UserService.CallDeleteUser(deletingUser.userId);
      if (res && res?.EC === 1) {
        toast.success("Xoá người dùng thành công!");
        setOpenDeleteModal(false);
        setDeletingUser(null);
        fetchUserData();
      } else {
        toast.error(res?.EM || "Đã có lỗi xảy ra khi xoá người dùng!");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Đã có lỗi xảy ra khi xoá người dùng!");
    }
  };

  const handleCreateUser = () => {
    setOpenCreateModal(true);
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

  React.useEffect(() => {
    fetchGenderList();
    fetchRoleList()
  }, []);



  const fetchGenderList = async () => {
    try {
      const res = await allCodeService.getGendersList()
      if (res && res?.EC === 1 && res.data?.GENDER
        && res.data.GENDER.length > 0
      ) {
        setGenderList(res.data.GENDER)
      }
    } catch (error) {
      console.log("Error from fetch gender list", error)
    }
  }


  const fetchRoleList = async () => {
    try {
      const res = await RoleService.CallFetchRolesList()
      if (res && res?.EC === 1 && res.data?.roles
        && res.data.roles.length > 0
      ) {
        setRoleList(res.data.roles)
      }
    } catch (error) {
      console.log("Error from fetch role list", error)
    }
  }

  const fetchUserData = async () => {
    try {
      const res = await UserService.CallGetAllUserList();
      if (res?.EC === 1 && res.data?.users) {
        setUserLIst(res.data.users);
      }
    } catch (error) {
      console.log("Error loading user list:", error);
    }
  };
  const fetchUserDataReverse = async () => {
    try {
      const res = await UserService.CallGetAllUserList();
      if (res?.EC === 1 && res.data?.users) {
        setUserLIst(res.data.users.reverse());
      }
    } catch (error) {
      console.log("Error loading user list reverse:", error);
    }
  };

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

          <Button
            onClick={() => handleCreateUser()}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-all duration-300">
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

      <CreateUserModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSuccess={() => fetchUserDataReverse()}
        genderList={genderList}
        roleList={roleList}
      />
      <EditUserModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        onSuccess={() => fetchUserDataReverse()}
        user={editingUser}
        genderList={genderList}
        roleList={roleList}
      />
      <ConfirmDeleteUserModal
        open={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false);
          setDeletingUser(null);
        }}
        onDeleted={() => {
          setOpenDeleteModal(false);
          setDeletingUser(null);
        }}
        userId={deletingUser?.userId ?? null}
        userName={deletingUser?.fullName}
        userEmail={deletingUser?.email}
        onDeleteUser={handleConfirmDelete}
      />
    </>
  );
}
