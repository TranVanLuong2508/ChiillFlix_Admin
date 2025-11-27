"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react";

interface DeleteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleDelete: () => void;
}

export const DeleteForm = ({
  open,
  onOpenChange,
  handleDelete
}: DeleteFormProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size={"sm"}
          className="cursor-pointer text-red-600 hover:text-red-600/80 focus:text-red-600 w-full flex justify-start"
        >
          <Trash2 />
          Xóa Tập Phim
        </Button>

      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-semibold">Xác nhận xóa tập phim</DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="cursor-pointer">
              Hủy
            </Button>
          </DialogClose>
          <Button
            className="hover:bg-red-600 cursor-pointer"
            onClick={handleDelete}
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}