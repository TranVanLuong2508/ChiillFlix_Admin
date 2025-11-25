"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import _ from "lodash";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import z from "zod";
import { formSchema } from "@/lib/validators/film";
import FilmService from "@/services/film.service";
import { toast } from "sonner";
import { FormCreateNewFilm } from "../../create/_components/formCreateNewFilm";
import { useFilmStore } from "@/stores/film.store";

export const MainSection = ({ id }: { id: string }) => {
  const router = useRouter();
  const { isLoadingDetail, filmDataUpdate, handleFetchDetailFilm } = useFilmStore();

  useEffect(() => {
    if (!id) return;

    console.log("Check film Id: ", id)
    handleFetchDetailFilm(id);
  }, [id]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // try {
    //   const payload = {
    //     ...values,
    //     duration: Number(values.duration),
    //   }

    //   const res = await FilmService.createFilm(payload);
    //   if (res.EC === 0 && res.data) {
    //     toast.success("Thêm phim thành công")
    //     setTimeout(() => {
    //       router.push(`/admin/movies`);
    //     }, 1000)
    //   } else {
    //     toast.error(res.EM);
    //   }
    // } catch (error) {
    //   console.log("Error when create new film: ", error);
    // }
    console.log("Check data update: ", values);
    const changeField = getChangeField(values);
    console.log("Check change field: ", changeField);
  }

  const getChangeField = (values: z.infer<typeof formSchema>) => {
    if (!filmDataUpdate) return;
    const specialKey = ["filmImages", "directors", "actors", "producers", "genreCodes"];
    const changeField = Object.keys(values).filter((key) => {
      if (values[key as keyof z.infer<typeof formSchema>] !== filmDataUpdate[key as keyof z.infer<typeof formSchema>]) {
        if (specialKey.includes(key)) {
          const result = _.isEqual(values[key as keyof z.infer<typeof formSchema>], filmDataUpdate[key as keyof z.infer<typeof formSchema>]);
          return !result;
        }
        return true;
      }
      return false;
    }
    );
    return changeField;
  }

  if (isLoadingDetail || !filmDataUpdate) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        className="flex items-center cursor-pointer"
        onClick={() => router.back()}
      >
        <ChevronLeft size={25} />
        <h1 className="text-lg font-semibold">Quay về</h1>
      </button>

      <h1 className="text-2xl font-bold text-center">Thông Tin Chi Tiết Phim</h1>

      <div>
        <Tabs defaultValue="main" className="w-full space-y-6">
          <TabsList>
            <TabsTrigger value="main">Quản lý phim</TabsTrigger>
            <TabsTrigger value="part">Quản lý tập phim</TabsTrigger>
          </TabsList>
          <TabsContent value="main">
            <FormCreateNewFilm onSubmit={onSubmit} initialData={filmDataUpdate} />
          </TabsContent>
          <TabsContent value="part">Quản lý tập phim</TabsContent>
        </Tabs>
      </div>
    </div>
  )
}