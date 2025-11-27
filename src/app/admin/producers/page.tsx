"use client";

import { useEffect, useState } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import { Button } from "@/components/ui/button";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { ProducerDialog } from "./_components/producer-dialog";
import { useProducerStore } from "@/stores/producerStore";

const ProducersPage = () => {
  const { producers, meta, loading, fetchProducers, deleteProducer } = useProducerStore();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const pageCount = meta ? meta.totalPages : 0;

  useEffect(() => {
    const page = pagination.pageIndex + 1;
    const limit = pagination.pageSize;
    fetchProducers(page, limit);
  }, [pagination.pageIndex, pagination.pageSize, fetchProducers]);

  const handleAddProducer = () => {
    setAddDialogOpen(true);
  };

  const handleDeleteSelected = async (ids: string[]) => {
    for (const id of ids) {
      await deleteProducer(Number(id));
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
              data={producers}
              pagination={pagination}
              pageCount={pageCount}
              hiddenColumns={[]}
              setPagination={setPagination}
              searchPlaceholder="Tìm theo tên nhà sản xuất..."
              addButton={
                <Button onClick={handleAddProducer} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                  Thêm nhà sản xuất
                </Button>
              }
              onDeleteSelected={handleDeleteSelected}
            />
          )}
        </div>
      </main>

      <ProducerDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} mode="create" />
    </div>
  );
};

export default ProducersPage;
