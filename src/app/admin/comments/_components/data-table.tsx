"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    OnChangeFn,
    PaginationState,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "../../../../components/table-comment/data-table-pagination";
import { DataTableViewOptions } from "../../../../components/table-comment/data-table-view-option";
import { DeleteCommentDialog } from "./delete-comment-dialog";
import { CommentColumn } from "@/types/comment.type";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    hiddenColumns: string[];
    pagination: PaginationState;
    pageCount: number;
    setPagination: OnChangeFn<PaginationState>;
    searchPlaceholder?: string;
    onSearch?: (value: string) => void;
    addButton?: React.ReactNode;
    onDeleteSelected?: (ids: string[]) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    hiddenColumns,
    pagination,
    pageCount,
    setPagination,
    searchPlaceholder,
    onSearch,
    addButton,
    onDeleteSelected,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>(
            hiddenColumns.reduce((acc, col) => ({ ...acc, [col]: false }), {})
        );
    const [rowSelection, setRowSelection] = React.useState({});
    const table = useReactTable({
        data,
        columns,
        pageCount,
        getRowId: (row: any) => row.commentId,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
    });

    const selectedRows = React.useMemo(
        () => {
            return table.getSelectedRowModel().rows.map((row) => row.original as CommentColumn);
        },
        [rowSelection, table]
    );
    const selectedRowIds = selectedRows.map((d) => d.commentId);
    const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);

    return (
        <div className="space-y-4">
            <DeleteCommentDialog
                open={bulkDeleteOpen}
                onOpenChange={setBulkDeleteOpen}
                commentId={selectedRowIds.join(",")}
                commentContent={selectedRows.map((d) => d.content.substring(0, 50)).join(", ")}
                isBulk
                onBulkDelete={async () => {
                    if (onDeleteSelected) await onDeleteSelected(selectedRowIds);
                    setBulkDeleteOpen(false);
                }}
            />
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    {addButton}
                    {selectedRowIds.length > 0 && onDeleteSelected && (
                        <button
                            className="px-3 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600"
                            onClick={() => setBulkDeleteOpen(true)}
                        >
                            Xóa đã chọn ({selectedRowIds.length})
                        </button>
                    )}
                </div>
                <DataTableViewOptions table={table} />
            </div>
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
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
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Không có dữ liệu để hiển thị.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
