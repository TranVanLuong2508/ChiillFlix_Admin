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
import { PartSection } from "./partSection";
import { EpisodeSection } from "./episodeSection";
import PartService from "@/services/part.service";
import { formatDate } from "@/utils/formateDate";
import { IPartDetail } from "@/types/part.type";

export const MainSection = ({ id }: { id: string }) => {
  const router = useRouter();
  const { isLoadingDetail, filmDataUpdate, handleFetchDetailFilm } = useFilmStore();
  const [parts, setParts] = useState<IPartDetail[]>([]);
  const [selectedPart, setSelectedPart] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    handleFetchDetailFilm(id);
    handleFetchParts();
  }, [id]);


  const handleFetchParts = async () => {
    const res = await PartService.getAllParts(id);
    if (res.EC === 0 && res.data) {
      const data = res.data.partData.map((part) => ({
        ...part,
        createdAt: formatDate(part.createdAt),
        updatedAt: formatDate(part.updatedAt),
      }));
      setParts(data);
    } else {
      toast.error(res.EM);
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const changeField = getChangeField(values);

    if (changeField && changeField.length > 0) {
      const dataUpdate = changeField.reduce((acc, key) => {
        acc[key] = values[key as keyof z.infer<typeof formSchema>];
        return acc;
      }, {} as Record<string, any>);

      let payload = {
        ...dataUpdate,
      }

      if ("duration" in dataUpdate) {
        payload.duration = Number(dataUpdate.duration);
      }

      if ("actors" in dataUpdate) {
        const checkNull = dataUpdate.actors.some((actor: any) => actor.characterName === "");
        if (checkNull) {
          toast.error("Vui lòng nhập tên nhân vật");
          return;
        }
      }

      const res = await FilmService.updateFilm(id, payload);
      if (res.EC === 0 && res.data) {
        toast.success(res.EM);
        handleFetchDetailFilm(id);
      } else {
        toast.error(res.EM);
      }
    }
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
    });
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

      <h1 className="text-2xl font-bold text-center">Thông Tin Chi Tiết</h1>

      <div>
        <Tabs defaultValue="main" className="w-full space-y-6">
          <TabsList>
            <TabsTrigger value="main">Quản lý phim</TabsTrigger>
            <TabsTrigger value="part">Quản lý phần</TabsTrigger>
            <TabsTrigger value="episode">Quản lý tập</TabsTrigger>
          </TabsList>
          <TabsContent value="main">
            <FormCreateNewFilm onSubmit={onSubmit} initialData={filmDataUpdate} />
          </TabsContent>
          <TabsContent value="part">
            <PartSection id={id} parts={parts} handleFetchParts={handleFetchParts} />
          </TabsContent>
          <TabsContent value="episode">
            <EpisodeSection id={id} parts={parts} selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}