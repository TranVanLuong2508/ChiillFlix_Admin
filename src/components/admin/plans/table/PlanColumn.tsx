import { IPlan } from "@/types/plan.type";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const planColumns = (
    onEdit: (id: number) => void,
): ColumnDef<IPlan>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px] cursor-pointer"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px] cursor-pointer"
                />
            ),
            enableSorting: false,
            enableHiding: false,
            size: 10,
        },
        {
            accessorKey: "planId",
            header: ({ column }) => (
                <Button
                    className="cursor-pointer"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ID <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: "planName",
            header: ({ column }) => (
                <Button
                    className="cursor-pointer"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tên gói <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: "price",
            header: ({ column }) => (
                <Button
                    className="cursor-pointer"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Giá <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const price = parseFloat(row.getValue("price"));
                const formatted = new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(price);
                return <div className="font-medium">{formatted}</div>;
            },
        },
        {
            accessorKey: "planDuration",
            header: ({ column }) => (
                <Button
                    className="cursor-pointer"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Thời gian <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const plan = row.original;
                return <div>{plan.durationInfo?.valueVi || `${plan.planDuration} ngày`}</div>;
            },
        },
        {
            accessorKey: "isActive",
            header: ({ column }) => (
                <div className="w-full flex justify-center ">
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
                            {active ? "Khả dụng" : "Không khả dụng"}
                        </span>
                    </div>
                );
            },
        },
        {
            id: "menu",
            enableHiding: false,
            cell: ({ row }) => {
                const plan = row.original;

                return (
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => navigator.clipboard.writeText(plan.planName.toString())}
                            >
                                Copy tên gói VIP
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(plan.planId)}>
                                Chỉnh sửa
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
