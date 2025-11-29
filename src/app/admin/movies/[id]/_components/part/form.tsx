"use client";

import z from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CirclePlus, SquarePen } from "lucide-react";

import { formPartSchema } from "@/lib/validators/part";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormPartProps {
  open: boolean;
  initialData?: z.infer<typeof formPartSchema>;
  isUpdate?: boolean;
  onSubmit: (values: z.infer<typeof formPartSchema>) => void;
  onOpenChange: (open: boolean) => void;
}

export const FormPart = ({
  open,
  initialData,
  isUpdate,
  onSubmit,
  onOpenChange,
}: FormPartProps) => {
  const form = useForm<z.infer<typeof formPartSchema>>({
    resolver: zodResolver(formPartSchema),
    defaultValues: initialData || {
      title: "",
      partNumber: "",
      description: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset();
    }
  }, [initialData, form, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {isUpdate ? (
          <Button
            variant={"ghost"}
            className="w-full flex justify-start cursor-pointer text-blue-600 focus:text-blue-600 hover:text-blue-600/80 bg-transparent"
            size={"sm"}
          >
            <SquarePen />
            Xem chi tiết
          </Button>
        ) : (
          <Button
            variant={"outline"}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-600 text-white hover:text-white cursor-pointer"
            size={"sm"}
          >
            <CirclePlus />
            Thêm mới
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "Cập nhật thông tin phần" : "Thêm phần mới"}</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}>
            <div className="grid gap-4 pb-4">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="partNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số thứ tự phần<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                >
                  Hủy
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className={cn(
                  "cursor-pointer",
                  initialData ? "bg-yellow-500 hover:bg-yellow-500/80" : "bg-blue-500 hover:bg-blue-500/90"
                )}
              >
                {initialData ? "Cập nhật" : "Thêm"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  )
}