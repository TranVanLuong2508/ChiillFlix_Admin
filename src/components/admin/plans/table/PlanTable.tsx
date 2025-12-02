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
import { IPlan } from "@/types/plan.type";
import PlansService from "@/services/planService";
import { planColumns } from "./PlanColumn";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { toast } from "sonner";
import { CreatePlanModal } from "../modals/CreatePlanModal";
import { EditPlanModal } from "../modals/EditPlanModal";

export function PlanTable() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const [planList, setPlanList] = React.useState<IPlan[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [openCreateModal, setOpenCreateModal] = React.useState(false);
    const [openEditModal, setOpenEditModal] = React.useState(false);
    const [editingPlanId, setEditingPlanId] = React.useState<number | null>(null);

    const handleEditPlan = (planId: number) => {
        setEditingPlanId(planId);
        setOpenEditModal(true);
    };

    const table = useReactTable({
        data: planList,
        columns: planColumns(handleEditPlan),
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
        fetchPlanData();
    }, []);

    const fetchPlanData = async () => {
        setLoading(true);
        try {
            const res = await PlansService.getAllPlans();
            if (res?.EC === 1 && res.data?.plans) {
                setPlanList(res.data.plans);
            } else {
                toast.error("Không thể tải danh sách gói VIP");
            }
        } catch (error) {
            console.log("Error loading plans:", error);
            toast.error("Đã có lỗi xảy ra khi tải danh sách gói VIP");
        } finally {
            setLoading(false);
        }
    };

    const fetchPlanDataToTop = async (planId: number) => {
        try {
            const res = await PlansService.getAllPlans();
            if (res?.EC === 1 && res.data?.plans) {
                const plans = res.data.plans;
                const newPlan = plans.find((p) => p.planId === planId);

                if (!newPlan) {
                    setPlanList(plans);
                    return;
                }

                const newList = [newPlan, ...plans.filter((p) => p.planId !== planId)];
                setPlanList(newList);
            }
        } catch (error) {
            console.log("Error fetch plan data to top:", error);
        }
    };

    return (
        <>
            <div className="w-full space-y-4">
                <div className="flex items-center py-4 gap-3">
                    <Input
                        placeholder="Tìm theo tên gói..."
                        value={(table.getColumn("planName")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("planName")?.setFilterValue(event.target.value)}
                        className="max-w-sm"
                    />

                    <Button
                        onClick={() => setOpenCreateModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-all duration-300"
                    >
                        + Thêm gói VIP
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
                                        planId: "ID",
                                        planName: "Tên gói",
                                        price: "Giá",
                                        planDuration: "Thời gian",
                                        isActive: "Trạng thái",
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
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={planColumns.length} className="h-24 text-center">
                                        Đang tải...
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => {
                                    return (
                                        <TableRow
                                            key={row.id}
                                            className={!row.original.isActive ? "bg-gray-100 opacity-70" : "bg-white"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={planColumns.length} className="h-24 text-center ">
                                        Không có dữ liệu
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <DataTablePagination table={table} />
            </div>

            <CreatePlanModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                onSuccess={(newPlanId) => fetchPlanDataToTop(newPlanId)}
            />
            <EditPlanModal
                open={openEditModal}
                planId={editingPlanId}
                onClose={() => {
                    setOpenEditModal(false);
                    setEditingPlanId(null);
                }}
                onSuccess={(planId) => fetchPlanDataToTop(planId)}
            />
        </>
    );
}
