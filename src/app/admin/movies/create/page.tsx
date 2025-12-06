"use client";

import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { FormCreateNewFilm } from "./_components/formCreateNewFilm";
import z from "zod";
import { formSchema } from "@/lib/validators/film";
import FilmService from "@/services/film.service";
import { toast } from "sonner";

const CreatePage = () => {
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const d = new Date();
      d.setHours(0, 0, 0, 0);

      const payload = {
        ...values,
        duration: Number(values.duration),
        releaseDate: values.releaseDate || d.toISOString(),
      }

      const res = await FilmService.createFilm(payload);
      if (res.EC === 0 && res.data) {
        toast.success("Thêm phim thành công")
        setTimeout(() => {
          router.push(`/admin/movies`);
        }, 1000)
      } else {
        toast.error(res.EM);
      }
    } catch (error) {
      console.log("Error when create new film: ", error);
    }
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
      <h1 className="text-2xl font-bold text-center">Tạo Phim Mới</h1>
      <FormCreateNewFilm onSubmit={onSubmit} />
    </div>
  )
}

export default CreatePage