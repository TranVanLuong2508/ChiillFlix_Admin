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
import { FilmColumn } from "@/types/film.type"
import { toast } from "sonner";
import FilmService from "@/services/film.service";
import { useFilmStore } from "@/stores/film.store";

interface ActionsProps {
  row: FilmColumn
}

export const Actions = ({ row }: ActionsProps) => {
  const { handleDeletedFilm } = useFilmStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
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
            navigator.clipboard.writeText(row.filmId);
            toast.success("Đã sao chép ID phim")
          }}
        >
          <Copy size={4} className="text-amber-500" />
          <strong>ID Phim</strong>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-blue-600 focus:text-blue-600"
          onClick={() => { console.log("OK") }}
        >
          <SquarePen size={4} className="text-blue-600" />
          Xem chi tiết
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={() => handleDeletedFilm(row.filmId)}
        >
          <Trash2 size={4} className="text-red-600" />
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}