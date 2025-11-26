"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, TriangleAlert } from "lucide-react";

interface DeleteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleDeletePart: () => void;
}

export const DeleteForm = ({
  open,
  onOpenChange,
  handleDeletePart
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
          Xóa phần
        </Button>

      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold">Xác nhận xóa phần</DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-amber-600/80">
            <TriangleAlert />
            Xóa phần sẽ xóa tất cả tập phim trong phần này
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="cursor-pointer">
              Hủy
            </Button>
          </DialogClose>
          <Button
            className="hover:bg-red-600 cursor-pointer"
            onClick={handleDeletePart}
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}