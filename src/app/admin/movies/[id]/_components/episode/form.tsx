"use client";

import z from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CirclePlus, SquarePen } from "lucide-react";

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
import { formEpisodeSchema } from "@/lib/validators/episode";
import { UploadThumb } from "./uploadThumb";

interface FormEpisodeProps {
  open: boolean;
  initialData?: z.infer<typeof formEpisodeSchema>;
  isUpdate?: boolean;
  onSubmit: (values: z.infer<typeof formEpisodeSchema>) => void;
  onOpenChange: (open: boolean) => void;
}

export const FormEpisode = ({
  open,
  initialData,
  isUpdate,
  onSubmit,
  onOpenChange,
}: FormEpisodeProps) => {
  const form = useForm<z.infer<typeof formEpisodeSchema>>({
    resolver: zodResolver(formEpisodeSchema),
    defaultValues: initialData || {
      title: "",
      episodeNumber: "",
      duration: "",
      videoUrl: "",
      thumbUrl: "",
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
            className="cursor-pointer"
            size={"sm"}
          >
            <CirclePlus />
            Thêm mới
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
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
              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="episodeNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Số thứ tự tập</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Thời lượng (phút)</FormLabel>
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
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL</FormLabel>
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
                  name="thumbUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail URL</FormLabel>
                      <FormControl>
                        <UploadThumb field={field} />
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