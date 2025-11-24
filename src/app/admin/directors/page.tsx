"use client";

import { useEffect, useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import { Button } from "@/components/ui/button";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { DirectorDialog } from "./_components/director-dialog";
import { useDirectorStore } from "@/stores/directorStore";

const DirectorsPage = () => {
  const { directors, meta, loading, fetchDirectors, deleteDirector } = useDirectorStore();
  const [pagination, setPagination] = useState<PaginationState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('director-pagination');
      if (saved) return JSON.parse(saved);
    }
    return { pageIndex: 0, pageSize: 10 };
  });
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const pageCount = meta ? meta.totalPages : 0;

  useEffect(() => {
    const page = pagination.pageIndex + 1;
    const limit = pagination.pageSize;
    fetchDirectors(page, limit);
  }, [pagination.pageIndex, pagination.pageSize, fetchDirectors]);

  const handleAddDirector = () => {
    setAddDialogOpen(true);
  };

  const handleDeleteSelected = async (ids: string[]) => {
    for (const id of ids) {
      await deleteDirector(Number(id));
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <AdminHeader />
      <main className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-muted-foreground">Đang tải...</div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={directors}
              pagination={pagination}
              pageCount={pageCount}
              hiddenColumns={["directorId", "slug", "story"]}
              setPagination={setPagination}
              searchPlaceholder="Tìm theo tên đạo diễn..."
              addButton={
                <Button onClick={handleAddDirector} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                  Thêm đạo diễn
                </Button>
              }
              onDeleteSelected={handleDeleteSelected}
            />
          )}
        </div>
      </main>

      <DirectorDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        mode="create"
      />
    </div>
  );
};

export default DirectorsPage;
