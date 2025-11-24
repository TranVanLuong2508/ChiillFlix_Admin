"use client";

import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { FormCreateNewFilm } from "./_components/formCreateNewFilm";
import z from "zod";
import { formSchema } from "@/lib/validators/film";

const CreatePage = () => {
  const router = useRouter();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(">>>Check data submit<<<")
    console.log(values)
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
      <FormCreateNewFilm onSubmit={onSubmit} />
    </div>
  )
}

export default CreatePage