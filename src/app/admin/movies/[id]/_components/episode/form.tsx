"use client";

import z from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CirclePlus, SquarePen } from "lucide-react";
import { cn } from "@/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { formEpisodeSchema } from "@/lib/validators/episode";

import { UploadThumb } from "./uploadThumb";
import { FormUploadVideo } from "./formUploadVideo";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

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
      duration: 0,
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
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-600 text-white hover:text-white cursor-pointer"
            size={"sm"}
          >
            <CirclePlus />
            Thêm mới
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <ScrollArea className="max-h-[calc(100vh-10rem)] rounded-md px-4 py-5">
          <DialogHeader className="pb-2">
            <DialogTitle>
              {initialData ? "Cập Nhật Thông Tin Tập" : "Thêm Tập Mới"}
            </DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}
              className="px-1"
            >
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
                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Thời lượng (phút)<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} type="number" min={0} />
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
                        <FormLabel>Thumbnail URL<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <UploadThumb field={field} />
                        </FormControl>
                        <FormMessage />
                        <div className="text-muted-foreground text-xs space-y-2">
                          <span>Lưu ý:</span>
                          <ul className="list-decimal pl-6">
                            <li>Thumbnail URL phải có định dạng .png, .jpg, .jpeg</li>
                            <li>Thumbnail URL phải có kích thước <strong>nhỏ hơn 2MB</strong></li>
                          </ul>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormUploadVideo
                        field={field}
                        onAddToQueue={() => onOpenChange(false)}
                      />
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
        </ScrollArea>
      </DialogContent>
    </Dialog >
  )
}