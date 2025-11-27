"use client";

import z from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ListOrdered } from "lucide-react";

import { IPartDetail } from "@/types/part.type";
import { formPartSchema } from "@/lib/validators/part";

import PartService from "@/services/part.service";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IEpisodeColumn } from "@/types/episode.type";
import { PaginationState } from "@tanstack/react-table";
import EpisodeService from "@/services/episode.service";
import { DataTable } from "./episode/data-table";
import { columns } from "./episode/columns";
import { formatDate } from "@/utils/formateDate";
import { formEpisodeSchema } from "@/lib/validators/episode";
import { generateSlug } from "@/utils/generateSlug";
import { usePartStore } from "@/stores/part.store";

export const EpisodeSection = ({ id }: { id: string }) => {
  const { hasUpdateEpisode, resetHasUpdateEpisode } = usePartStore();

  const [parts, setParts] = useState<IPartDetail[]>([]);
  const [selectedPart, setSelectedPart] = useState<string>("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [episodeData, setEpisodeData] = useState<IEpisodeColumn[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    handleFetchParts();
  }, [id])

  useEffect(() => {
    if (hasUpdateEpisode) {
      getEpisodePagination();
      resetHasUpdateEpisode();
    }
  }, [hasUpdateEpisode])

  useEffect(() => {
    if (selectedPart === "") return;
    getEpisodePagination()
  }, [pagination.pageIndex, pagination.pageSize, selectedPart]);

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

  const getEpisodePagination = async () => {
    const res = await EpisodeService.getAll(pagination.pageIndex + 1, pagination.pageSize, selectedPart);
    if (res.EC === 0 && res.data && res.data.result.length > 0) {
      const data = res.data.result.map((episode) => ({
        ...episode,
        createdAt: formatDate(episode.createdAt),
        updatedAt: formatDate(episode.updatedAt),
      }));

      setEpisodeData(data);

      if (res.data.meta && pageCount !== res.data.meta.pages) {
        setPageCount(res.data.meta.pages);
      }
    } else {
      if (res.data && res.data.result.length === 0) {
        toast.info("Không có dữ liệu");
      } else {
        toast.error(res.EM);
      }
    }
  };

  const handleCreateEpisode = async (values: z.infer<typeof formEpisodeSchema>) => {
    const payload = {
      ...values,
      slug: generateSlug(values.title),
      episodeNumber: Number(values.episodeNumber),
      duration: Number(values.duration),
      partId: selectedPart,
    }
    const res = await EpisodeService.createEpisode(payload);
    if (res.EC === 0 && res.data) {
      toast.success(res.EM);
      setIsCreateOpen(false);
      getEpisodePagination();
    } else {
      toast.error(res.EM);
    }
  };


  if (!parts || parts.length === 0) {
    return (
      <div className="py-[50px]">
        <h2 className="text-center text-lg font-semibold text-amber-500">
          Vui lòng tạo phần phim mới và quay lại !
        </h2>
      </div>
    )
  }

  return (
    <div className="mx-[100px]">
      <div className="flex justify-between pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ListOrdered size={20} />
            <span className="border-b border-zinc-500">
              Danh sách tập phim:
            </span>
          </h2>
          <Select value={selectedPart} onValueChange={setSelectedPart}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn phần" />
            </SelectTrigger>
            <SelectContent>
              {parts.map((part) => (
                <SelectItem key={part.id} value={part.id}>
                  {part.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-x-2">
        </div>
      </div>
      <div>
        {selectedPart !== "" && (
          <DataTable
            data={episodeData}
            pageCount={pageCount}
            pagination={pagination}
            setPagination={setPagination}
            columns={columns}
            hiddenColumns={["id", "partId", 'videoUrl', 'thumbUrl']}
            isOpenCreate={isCreateOpen}
            onOpenCreateChange={setIsCreateOpen}
            handleCreateEpisode={handleCreateEpisode}
          />
        )}
      </div>
    </div>
  )
}