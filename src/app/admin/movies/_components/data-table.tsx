"use client";

import { useState } from "react"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  OnChangeFn,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DataTablePagination } from "@/components/table/data-table-pagination"
import { DataTableViewOptions } from "@/components/table/data-table-view-option"
import { ArchiveRestore, CirclePlus, CircleX, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner";
import FilmService from "@/services/film.service";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  hiddenColumns: string[];
  pagination: PaginationState;
  pageCount: number;
  setPagination: OnChangeFn<PaginationState>;
  onSuccess?: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  hiddenColumns,
  pagination,
  pageCount,
  setPagination,
  onSuccess,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    ...hiddenColumns.reduce((acc, column) => {
      acc[column] = false;
      return acc;
    }, {} as VisibilityState),
  });
  const [rowSelection, setRowSelection] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);


  const handleDeleteSelected = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    setIsLoading(true);
    try {
      const listFilmId = selectedRows.map((row: any) => row.original.filmId);

      const res = await FilmService.bulkDelete(listFilmId);
      if (res.EC === 0 && res.data) {
        toast.success(`Đã xóa ${res.data.deletedCount} phim`);
        setRowSelection({});
        if (onSuccess) onSuccess();
      } else {
        toast.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
        console.log(">> Error Soft Delete Bulk Film: ", res.EM);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
      console.error('>> Error Soft Delete Bulk Film: ', error);
    } finally {
      setIsLoading(false);
    }
  };


  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
      pagination,
    },
  });

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Input
            placeholder="Nhập tên phim..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex items-center gap-2">
            <DataTableViewOptions table={table} />
            <div>
              <Button
                size={"sm"}
                variant={"outline"}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-600/90 text-white hover:text-white cursor-pointer"
                onClick={() => router.push("/admin/movies/create")}
              >
                <CirclePlus />
                <span>Thêm mới</span>
              </Button>
            </div>
            <Button
              size={"sm"}
              variant={"outline"}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-600/80 text-white hover:text-white cursor-pointer"
              disabled={table.getFilteredSelectedRowModel().rows.length === 0 || isLoading}
              onClick={() => setOpen(true)}
            >
              <CircleX />
              <span>Xóa</span>
            </Button>
            <Button
              size={"sm"}
              variant={"outline"}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-700/90 text-white hover:text-white cursor-pointer"
              onClick={() => router.push("/admin/movies/trash")}
            >
              <Trash />
              <span>Thùng rác</span>
            </Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa thông tin phim</AlertDialogTitle>
            <AlertDialogDescription>
              Lưu ý: Sau khi xóa có thể vào thùng rác để khôi phục dữ liệu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="cursor-pointer"
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSelected}
              className="bg-zinc-900 cursor-pointer hover:bg-red-500 text-white hover:text-white"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}