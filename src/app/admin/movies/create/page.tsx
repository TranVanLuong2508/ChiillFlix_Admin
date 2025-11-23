"use client";

import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { FormCreateNewFilm } from "./_components/formCreateNewFilm";

const CreatePage = () => {
  const router = useRouter();

  return (
    <div className="space-y-2">
      <button
        className="flex items-center cursor-pointer"
        onClick={() => router.back()}
      >
        <ChevronLeft size={25} />
        <h1 className="text-lg font-semibold">Quay về</h1>
      </button>
      <FormCreateNewFilm />
    </div>
  )
}

export default CreatePage