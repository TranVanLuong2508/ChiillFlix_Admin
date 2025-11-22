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
import { MoreHorizontal } from "lucide-react"
import { FilmColumn } from "@/types/film.type"

interface ActionsProps {
  row: FilmColumn
}

export const Actions = ({ row }: ActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(row.filmId)}
        >
          Copy film ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-blue-600" onClick={() => { console.log("OK") }}>View Detail</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={() => { console.log("OK") }}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}