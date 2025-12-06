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
import { ArchiveRestore, Copy, MoreHorizontal, Shredder } from "lucide-react"
import { FilmColumn } from "@/types/film.type"
import { toast } from "sonner";
import { useFilmStore } from "@/stores/film.store";
import { useRouter } from "next/navigation";

interface ActionsProps {
  row: FilmColumn
}

export const Actions = ({ row }: ActionsProps) => {
  const router = useRouter();
  const { handleDeletedFilm } = useFilmStore();

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
          onClick={() => { router.push(`/admin/movies/${row.filmId}`) }}
        >
          <ArchiveRestore size={4} className="text-blue-600" />
          Khôi phục
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={() => handleDeletedFilm(row.filmId)}
        >
          <Shredder size={4} className="text-red-600" />
          Xóa vĩnh viễn
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}