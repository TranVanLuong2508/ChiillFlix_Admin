"use client";

import AdminHeader from "@/components/admin/layout/AdminHeader";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { FilmColumn } from "@/types/film.type";

const MoviesPage = () => {
  const data: FilmColumn[] = [
    {
      filmId: "1",
      title: "Movie 1",
      originalTitle: "Movie 1",
      slug: "movie-1",
      view: 100,
      publicStatusCode: "public",
      createdAt: '20/11/2025',
      updatedAt: '20/11/2025',
      duration: 120,
      country: "Vietnam",
      language: "Vietnamese",
    },
    {
      filmId: "1",
      title: "Movie 1",
      originalTitle: "Movie 1",
      slug: "movie-1",
      view: 100,
      publicStatusCode: "public",
      createdAt: '20/11/2025',
      updatedAt: '20/11/2025',
      duration: 120,
      country: "Vietnam",
      language: "Vietnamese",
    },
  ]

  return (
    <div className="flex flex-col h-full w-full">
      <AdminHeader />

      <main className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="container mx-auto">
          <DataTable columns={columns} data={data} hiddenColumns={["slug", "country", "language"]} />
        </div>
      </main>
    </div>
  );
};

export default MoviesPage;
