"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "../../../../components/table-director/data-table-column-header"
import { Actions } from "./actions"
import type { ProducerColumn } from "@/types/producer.type"

export const columns: ColumnDef<ProducerColumn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "producerId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Mã NSX" />,
    cell: ({ row }) => <div>{row.getValue("producerId")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "producerName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tên Nhà Sản Xuất" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("producerName")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "slug",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Slug" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("slug")}</div>,
    enableSorting: false,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const producer = row.original
      return <Actions producer={producer} />
    },
  },
]
