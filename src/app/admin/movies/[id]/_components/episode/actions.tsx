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
import { IEpisodeColumn } from "@/types/episode.type"
import { useEffect, useState } from "react";
import z from "zod";
import { formPartSchema } from "@/lib/validators/part";
import { formEpisodeSchema } from "@/lib/validators/episode";
import { usePartStore } from "@/stores/part.store";
import { FormEpisode } from "./form";
import { DeleteForm } from "./deleteForm";

interface ActionsProps {
  row: IEpisodeColumn
}

export const Actions = ({ row }: ActionsProps) => {
  const { handleUpdateEpisode, handleDeleteEpisode } = usePartStore();

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [initDataUpdate, setInitDataUpdate] = useState<z.infer<typeof formEpisodeSchema> | null>(null);

  useEffect(() => {
    if (row) {
      const data: z.infer<typeof formEpisodeSchema> = {
        title: row.title,
        episodeNumber: row.episodeNumber.toString(),
        duration: row.duration.toString(),
        videoUrl: row.videoUrl,
        thumbUrl: row.thumbUrl,
      }
      setInitDataUpdate(data);
    }
  }, [row]);


  const handleUpdate = async (values: z.infer<typeof formEpisodeSchema>) => {
    await handleUpdateEpisode(row.partId, row.id, values);
    setIsUpdateOpen(false);
  }

  const handleDelete = async () => {
    await handleDeleteEpisode(row.id);
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
        >
          <Copy size={4} className="text-amber-500" />
          <strong>ID Phim</strong>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {initDataUpdate && (
          <DropdownMenuItem
            className="cursor-pointer text-blue-600 focus:text-blue-600"
            asChild
          >
            <FormEpisode
              open={isUpdateOpen}
              initialData={initDataUpdate}
              isUpdate={true}
              onSubmit={handleUpdate}
              onOpenChange={setIsUpdateOpen}
            />
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          asChild
        >
          <DeleteForm
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            handleDelete={handleDelete}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}