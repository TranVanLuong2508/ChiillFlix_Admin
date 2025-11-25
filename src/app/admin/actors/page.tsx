"use client";

import { useEffect, useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import { Button } from "@/components/ui/button";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { ActorDialog } from "./_components/actor-dialog";
import { useActorStore } from "@/stores/actorStore";
import { Skeleton } from "@/components/ui/skeleton";

const ActorsPage = () => {
  const { actors, meta, loading, fetchActors, deleteActor } = useActorStore();
  const [pagination, setPagination] = useState<PaginationState>(() => {
    return { pageIndex: 0, pageSize: 10 };
  });
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const pageCount = meta ? meta.totalPages : 0;

  useEffect(() => {
    const page = pagination.pageIndex + 1;
    const limit = pagination.pageSize;
    fetchActors(page, limit);

  }, [pagination.pageIndex, pagination.pageSize, fetchActors]);

  const handleAddActor = () => {
    setAddDialogOpen(true);
  };

  const handleDeleteSelected = async (ids: string[]) => {
    for (const id of ids) {
      await deleteActor(Number(id));
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <AdminHeader />
      <main className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="space-y-4">
          {loading ? (

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-[300px]" />
                <Skeleton className="h-10 w-[140px]" />
              </div>

              <div className="rounded-md border">
                <div className="border-b bg-muted/50 p-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>

                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="border-b p-4 last:border-0">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[120px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-[250px]" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-[100px]" />
                  <Skeleton className="h-8 w-[70px]" />
                  <Skeleton className="h-8 w-[70px]" />
                </div>
              </div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={actors}
              pagination={pagination}
              pageCount={pageCount}
              hiddenColumns={["slug", "shortBio"]}
              setPagination={setPagination}
              searchPlaceholder="Tìm theo tên diễn viên..."
              addButton={
                <Button onClick={handleAddActor} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                  Thêm diễn viên
                </Button>
              }
              onDeleteSelected={handleDeleteSelected}
            />
          )}
        </div>
      </main>

      <ActorDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        mode="create"
      />
    </div>
  );
};

export default ActorsPage;
