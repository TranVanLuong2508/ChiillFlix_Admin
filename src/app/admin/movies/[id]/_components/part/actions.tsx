"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Copy, MoreHorizontal, SquarePen, Trash2 } from "lucide-react"
import { toast } from "sonner";
import { useFilmStore } from "@/stores/film.store";
import { useRouter, useSearchParams } from "next/navigation";
import { IPartColumn } from "@/types/part.type";
import { FormPart } from "./form";
import { useEffect, useState } from "react";
import { usePartStore } from "@/stores/part.store";
import z from "zod";
import { formPartSchema } from "@/lib/validators/part";
import { DeleteForm } from "./deleteForm";

interface ActionsProps {
  row: IPartColumn
}

export const Actions = ({ row }: ActionsProps) => {
  const { handleUpdatePart, handleDeletePart } = usePartStore();
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [initDataUpdate, setInitDataUpdate] = useState<z.infer<typeof formPartSchema> | null>(null);

  useEffect(() => {
    if (row) {
      const data: z.infer<typeof formPartSchema> = {
        title: row.title,
        partNumber: row.partNumber.toString(),
        description: row.description,
      }
      setInitDataUpdate(data);
    }
  }, [row]);

  const handleUpdate = async (values: z.infer<typeof formPartSchema>) => {
    await handleUpdatePart(row.filmId, row.id, values);
    setIsUpdateOpen(false);
  }

  const handleDelete = async () => {
    await handleDeletePart(row.id);
    setIsDeleteOpen(false);
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel className="text-center">Thao tác</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(row.id);
            toast.success("Đã sao chép ID phần")
          }}
        >
          <Copy size={4} className="text-amber-500" />
          <strong>ID Phần</strong>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {initDataUpdate && (
          <>
            <DropdownMenuItem
              className="cursor-pointer text-blue-600 focus:text-blue-600"
              asChild
            >
              <FormPart
                onSubmit={handleUpdate}
                open={isUpdateOpen}
                onOpenChange={setIsUpdateOpen}
                isUpdate={true}
                initialData={initDataUpdate}
              />
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          asChild
        >
          <DeleteForm open={isDeleteOpen} onOpenChange={setIsDeleteOpen} handleDeletePart={handleDelete} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}