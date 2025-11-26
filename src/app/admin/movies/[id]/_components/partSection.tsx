"use client";

import z from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { IPartDetail } from "@/types/part.type";
import { formPartSchema } from "@/lib/validators/part";

import PartService from "@/services/part.service";

import { DataTable } from "./part/data-table";
import { columns } from "./part/columns";
import { formatDate } from "@/utils/formateDate";
import { usePartStore } from "@/stores/part.store";

export const PartSection = ({ id }: { id: string }) => {
  const { hasUpdateData, resetHasUpdateData } = usePartStore();

  const [parts, setParts] = useState<IPartDetail[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    handleFetchParts();
  }, [id])

  useEffect(() => {
    if (hasUpdateData) {
      handleFetchParts();
      resetHasUpdateData();
    }
  }, [hasUpdateData])

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

  const handleCreatePart = async (values: z.infer<typeof formPartSchema>) => {
    const payload = {
      ...values,
      partNumber: Number(values.partNumber),
      filmId: id
    }
    const res = await PartService.createPart(payload);
    if (res.EC === 0 && res.data) {
      toast.success(res.EM);
      handleFetchParts();
      setIsCreateOpen(false);
    } else {
      toast.error(res.EM);
    }
  };

  return (
    <>
      <div className="mx-[100px]">
        <DataTable
          columns={columns}
          data={parts}
          hiddenColumns={['id', 'filmId']}
          isOpenCreate={isCreateOpen}
          onOpenCreateChange={setIsCreateOpen}
          handleCreatePart={handleCreatePart}
        />
      </div>

    </>
  )
}