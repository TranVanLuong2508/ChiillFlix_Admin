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
            className="cursor-pointer text-blue-600 focus:text-blue-600 hover:text-blue-600/80 bg-transparent"
            size={"sm"}
          >
            <SquarePen />
            Thông tin phần
          </Button>
        ) : (
          <Button
            variant={"outline"}
            className="cursor-pointer"
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
                      <FormLabel>Tiêu đề</FormLabel>
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
                      <FormLabel>Số thứ tự phần</FormLabel>
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
                      <FormLabel>Mô tả</FormLabel>
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
                >
                  Hủy
                </Button>
              </DialogClose>
              <Button
                type="submit"
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