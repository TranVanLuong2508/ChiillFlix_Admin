"use client";

import FilmService from "@/services/film.service";
import { useFilmStore } from "@/stores/film.store";
import { FilmDeletedColumn } from "@/types/film.type";
import { formatDate } from "@/utils/formateDate";
import { PaginationState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const TrashPage = () => {
  const router = useRouter();
  const { isLoadingDelete } = useFilmStore();

  const [filmData, setFilmData] = useState<FilmDeletedColumn[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const getFilmPagination = async () => {
    const res = await FilmService.getFilmDeletedPagination(pagination.pageIndex + 1, pagination.pageSize);
    if (res.EC === 0 && res.data && res.data.result.length > 0) {
      console.log("Check data: ", res.data.result);
      const data: FilmDeletedColumn[] = res.data.result.map((item) => ({
        filmId: item.filmId,
        title: item.title,
        originalTitle: item.originalTitle,
        slug: item.slug,
        view: item.view,
        createdAt: formatDate(item.createdAt),
        updatedAt: formatDate(item.updatedAt),
        deletedAt: formatDate(item.deletedAt),
        duration: item.duration,
        publicStatus: item.publicStatus.valueVi,
        country: item.country.valueVi,
        language: item.language.valueVi,
        deletedBy: item.deletedBy,
      }));

      setFilmData(data);

      if (res.data.meta && pageCount !== res.data.meta.pages) {
        setPageCount(res.data.meta.pages);
      }
    } else {
      if (res.data && res.data.result.length === 0) {
        setFilmData([]);
      } else {
        toast.error(res.EM);
      }
    }
  };

  useEffect(() => {
    if (isLoadingDelete) return;

    getFilmPagination();
  }, [pagination.pageIndex, pagination.pageSize, isLoadingDelete]);

  return (
    <div>
      <button
        className="flex items-center cursor-pointer mb-2"
        onClick={() => router.back()}
      >
        <ChevronLeft size={25} />
        <h1 className="text-lg font-semibold">Quay về</h1>
      </button>
      <DataTable
        columns={columns}
        data={filmData}
        pagination={pagination}
        pageCount={pageCount}
        hiddenColumns={["filmId", "slug", "country", "view", "createdAt", "updatedAt", "language", "publicStatus", "duration"]}
        setPagination={setPagination}
        onSuccess={getFilmPagination}
      />
    </div>
  )
}

export default TrashPage