"use client";

import z from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BadgePlus, ListOrdered, SquarePen } from "lucide-react";

import { IPartDetail } from "@/types/part.type";
import { formPartSchema } from "@/lib/validators/part";

import PartService from "@/services/part.service";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button";

import { FormPart } from "./part/form";

export const PartSection = ({ id }: { id: string }) => {
  const [parts, setParts] = useState<IPartDetail[]>([]);
  const [selectedPart, setSelectedPart] = useState<string>("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [updateOpenId, setUpdateOpenId] = useState<string | null>(null);

  useEffect(() => {
    handleFetchParts();
  }, [id])


  const handleFetchParts = async () => {
    const res = await PartService.getAllParts(id);
    if (res.EC === 0 && res.data) {
      setParts(res.data.partData);
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

  const handleUpdatePart = async (values: z.infer<typeof formPartSchema>) => {
    const payload = {
      ...values,
      partNumber: Number(values.partNumber),
      filmId: id
    }
    const res = await PartService.updatePart(selectedPart, payload);
    if (res.EC === 0 && res.data) {
      toast.success(res.EM);
      handleFetchParts();
      setUpdateOpenId(null);
    } else {
      toast.error(res.EM);
    }
  };

  const handleGetDetailPart = (partId: string): z.infer<typeof formPartSchema> => {
    const part = parts.find((part) => part.id === partId);
    if (!part) {
      toast.error("Part not found");
      return {
        title: "",
        partNumber: "",
        description: "",
      }
    }
    return {
      title: part.title,
      partNumber: part.partNumber.toString(),
      description: part.description,
    }
  }

  return (
    <div className="mx-[200px]">
      <div className="flex justify-between pb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ListOrdered size={20} />
          <span className="border-b border-zinc-500">
            Danh sách phần & tập phim:
          </span>
        </h2>
        <FormPart
          onSubmit={handleCreatePart}
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
        />
      </div>
      <Accordion
        type="single"
        collapsible
        className="w-full space-y-2"
        defaultValue={parts[0]?.id}
        value={selectedPart}
        onValueChange={setSelectedPart}
      >
        {parts.length > 0 && parts.map((part) => {
          const detailPart = handleGetDetailPart(part.id);
          return (
            <AccordionItem
              key={part.id}
              value={part.id}
              className="border-0"
            >
              <AccordionTrigger
                className="cursor-pointer border border-zinc-900 px-4">
                Phần {part.partNumber}
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance p-4 min-h-[120px]">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Danh sách tập phim:</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={"outline"}
                      size={"sm"}
                      className="cursor-pointer"
                    >
                      <BadgePlus />
                      Thêm tập
                    </Button>
                    <FormPart
                      onSubmit={handleUpdatePart}
                      open={updateOpenId === part.id}
                      onOpenChange={(open) => open ? setUpdateOpenId(part.id) : setUpdateOpenId(null)}
                      initialData={detailPart}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="h-9 w-[67px] flex items-center justify-center rounded-md border border-zinc-900 text-zinc-900 font-semibold text-xs cursor-pointer hover:border-amber-500 hover:bg-amber-400/20">
                      <span>Tập {index + 1}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>

  )
}