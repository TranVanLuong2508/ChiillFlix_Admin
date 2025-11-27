"use client";

import { ImageType } from "@/types/film.type";
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { formSchema } from "@/lib/validators/film"
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { DatePicker } from "./datePicker";
import { toast } from "sonner";
import { UploadImage } from "./uploadImage";
import allCodeServie from "@/services/all_code.service";
import { ALL_CODE_TYPES } from "@/types/all_code.type";
import { AllCodeRow } from "@/types/backend.type";
import { SelectForm } from "./selectForm";
import { MultiSelectForm } from "./multiSelectForm";
import { ActorForm } from "./actor/actorForm";
import { DirectorForm } from "./director/directorForm";
import { ProducerForm } from "./producer/producerForm";
import { UploadThumb } from "./uploadThumb";
import { cn } from "@/lib/utils";

interface FormCreateNewFilmProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  initialData?: z.infer<typeof formSchema>
}

export const FormCreateNewFilm = ({ onSubmit, initialData }: FormCreateNewFilmProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      originalTitle: "",
      title: "",
      description: "",
      releaseDate: "",
      year: "",
      slug: "",
      thumbUrl: "",
      ageCode: "",
      duration: "",
      typeCode: "",
      genreCodes: [],
      countryCode: "",
      langCode: "",
      publicStatusCode: "",
      filmImages: [
        { type: ImageType.POSTER, url: "" },
        { type: ImageType.HORIZONTAL, url: "" },
        { type: ImageType.BACKDROP, url: "" },
      ],
      directors: [],
      actors: [],
      producers: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "filmImages",
  });

  const [rating, setRating] = useState<AllCodeRow[]>([])
  const [country, setCountry] = useState<AllCodeRow[]>([])
  const [version, setVersion] = useState<AllCodeRow[]>([])
  const [filmType, setFilmType] = useState<AllCodeRow[]>([])
  const [genre, setGenre] = useState<AllCodeRow[]>([])
  const [filmStatus, setFilmStatus] = useState<AllCodeRow[]>([])

  const handleFetchRating = async (type: ALL_CODE_TYPES, setRating: React.Dispatch<React.SetStateAction<AllCodeRow[]>>) => {
    try {
      const res = await allCodeServie.getByType(type);
      if (res.EC !== 0 && res.data) {
        setRating(res.data[type]);
      } else {
        toast.error(res.EM);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchConfigs = [
      { type: ALL_CODE_TYPES.RANK, setter: setRating },
      { type: ALL_CODE_TYPES.COUNTRY, setter: setCountry },
      { type: ALL_CODE_TYPES.VERSION, setter: setVersion },
      { type: ALL_CODE_TYPES.FILM_TYPE, setter: setFilmType },
      { type: ALL_CODE_TYPES.GENRE, setter: setGenre },
      { type: ALL_CODE_TYPES.FILM_STATUS, setter: setFilmStatus },
    ];

    fetchConfigs.forEach(({ type, setter }) => {
      handleFetchRating(type, setter);
    });
  }, []);

  return (
    <div className="mx-[200px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))} className="space-y-8">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="originalTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên gốc phim</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Tên nước ngoài của phim nếu có không thì điền tên phim vào trường này.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên phim</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả phim"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>


          <div className="flex items-center justify-between gap-4">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Thời lượng phim (phút)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Năm</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="releaseDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Ngày công chiếu</FormLabel>
                  <FormControl>
                    <DatePicker field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <FormField
              control={form.control}
              name="ageCode"
              render={({ field }) => (
                <SelectForm
                  label="Giới hạn độ tuổi"
                  placeholder="Chọn giới hạn độ tuổi"
                  field={field}
                  selectOption={rating}
                />
              )}
            />

            <FormField
              control={form.control}
              name="langCode"
              render={({ field }) => (
                <SelectForm
                  label="Ngôn ngữ"
                  placeholder="Chọn ngôn ngữ"
                  field={field}
                  selectOption={version}
                />
              )}
            />

            <FormField
              control={form.control}
              name="countryCode"
              render={({ field }) => (
                <SelectForm
                  label="Quốc gia"
                  placeholder="Chọn quốc gia"
                  field={field}
                  selectOption={country}
                />
              )}
            />
          </div>

          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="typeCode"
              render={({ field }) => (
                <div className="flex flex-col flex-1">
                  <SelectForm
                    label="Phân loại"
                    placeholder="Chọn loại hình phim"
                    field={field}
                    selectOption={filmType}
                  />
                  <div className="invisible">&nbsp;</div>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nhập slug muốn tạo có dấu hoặc không dấu" />
                  </FormControl>
                  <FormDescription>
                    Ví dụ: "đây là slug" hoặc "day la slug"
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="publicStatusCode"
              render={({ field }) => (
                <div className="flex flex-col flex-1">
                  <SelectForm
                    label="Trạng thái"
                    placeholder="Chọn trạng thái"
                    field={field}
                    selectOption={filmStatus}
                  />
                  <div className="invisible">&nbsp;</div>
                </div>
              )}
            />

          </div>
          <div className="flex items-center justify-between gap-4">
            <FormField
              control={form.control}
              name="genreCodes"
              render={({ field }) => (
                <MultiSelectForm
                  label="Thể loại phim"
                  placeholder="Chọn thể loại phim..."
                  field={field}
                  options={genre}
                  message="Chưa chọn thể loại phim"
                />
              )}
            />

          </div>
          <FormField
            control={form.control}
            name="producers"
            render={({ field }) => (
              <ProducerForm field={field} />
            )}
          />

          <FormField
            control={form.control}
            name="actors"
            render={({ field }) => (
              <ActorForm field={field} />
            )}
          />

          <FormField
            control={form.control}
            name="directors"
            render={({ field }) => (
              <DirectorForm field={field} />
            )}
          />

          <FormField
            control={form.control}
            name="thumbUrl"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Upload thumbnail</FormLabel>
                <FormControl>
                  <UploadThumb field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormItem>
            <FormLabel>Upload ảnh</FormLabel>
            <FormControl>
              <UploadImage fields={fields} form={form} />
            </FormControl>
            <FormMessage />
          </FormItem>

          <Button type="submit" className={cn(
            "cursor-pointer w-full",
            initialData ? "bg-yellow-500 hover:bg-yellow-500/90" : "bg-blue-500 hover:bg-blue-500/90"
          )}>
            {initialData ? "Cập nhật" : "Tạo mới"}
          </Button>
        </form>
      </Form>
    </div>
  )
}