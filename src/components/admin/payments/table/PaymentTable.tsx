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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PaymentService from "@/services/paymentService";
import { IPayment } from "@/types/payment.type";
import { useEffect, useState } from "react";
import { PaymentColumns } from "./PaymentColums";
import { Settings2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const PaymentTable = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [payments, setPayments] = useState<IPayment[]>([]);

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      const res = await PaymentService.CallGetPaymentList();

      if (res && res.EC === 1) {
        setPayments(res.data?.payments ?? []);
      }
    } catch (error) {
      console.log("Error from fetch payment data <<PayementTable>>: ", error);
    }
  };

  const handleEditPayment = (userId: string) => {
    console.log("EDIT USER: ", userId);
  };

  const handleDeletePayment = async (userId: string) => {
    console.log("DELTE USER: ", userId);
  };

  const table = useReactTable({
    data: payments,
    columns: PaymentColumns(handleEditPayment, handleDeletePayment),
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
    fetchPaymentData();
  }, []);

  const exportPDF = async () => {
    document.body.classList.add("pdf-mode");

    const element = document.getElementById("payment-report");
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    document.body.classList.remove("pdf-mode");

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("payment-report.pdf");
  };
  console.log("Check payment data: ", payments);
  return (
    <>
      <>
        <div className="w-full space-y-4">
          <div className="flex items-center py-4 gap-3">
            <Input
              placeholder="Tìm theo tên người dùng..."
              value={(table.getColumn("userName")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("userName")?.setFilterValue(event.target.value)}
              className="max-w-sm"
            />

            <Button onClick={exportPDF} className="bg-red-600 text-white">
              Xuất PDF Báo Cáo
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
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div id="payment-report" className="pdf-area">
            <div className="overflow-hidden rounded-md border ">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
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
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={PaymentColumns.length} className="h-24 text-center ">
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DataTablePagination table={table} />
        </div>
      </>
    </>
  );
};
