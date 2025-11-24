"use client";

import { useEffect, useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";
import { formatDate } from "@/utils/formateDate";
import { FilmColumn } from "@/types/film.type";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

import FilmService from "@/services/film.service";
import { useFilmStore } from "@/stores/film.store";

const MoviesPage = () => {
  const { isLoadingDelete } = useFilmStore();


  const [filmData, setFilmData] = useState<FilmColumn[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const getFilmPagination = async () => {
    const res = await FilmService.getFilmPagination(pagination.pageIndex + 1, pagination.pageSize);
    if (res.EC === 0 && res.data && res.data.result.length > 0) {
      const data = res.data.result.map((item) => ({
        filmId: item.filmId,
        title: item.title,
        originalTitle: item.originalTitle,
        slug: item.slug,
        view: item.view,
        createdAt: formatDate(item.createdAt),
        updatedAt: formatDate(item.updatedAt),
        duration: item.duration,
        publicStatus: item.publicStatus.valueVi,
        country: item.country.valueVi,
        language: item.language.valueVi,
      }));

      setFilmData(data);

      if (res.data.meta && pageCount !== res.data.meta.pages) {
        setPageCount(res.data.meta.pages);
      }
    } else {
      if (res.data && res.data.result.length === 0) {
        toast.info("No data");
      } else {
        toast.error(res.EM);
      }
    }
  };

  useEffect(() => {
    if (isLoadingDelete) return;

    getFilmPagination()
  }, [pagination.pageIndex, pagination.pageSize, isLoadingDelete]);

  return (
    <div>
      <DataTable
        columns={columns}
        data={filmData}
        pagination={pagination}
        pageCount={pageCount}
        hiddenColumns={["filmId", "slug", "country", "language"]}
        setPagination={setPagination}
      />
    </div>
  );
};

export default MoviesPage;
