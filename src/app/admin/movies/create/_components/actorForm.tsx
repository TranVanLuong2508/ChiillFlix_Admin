"use client";

import { useState } from "react";
import { AllCodeRow } from "@/types/backend.type";

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown, ListChecks } from "lucide-react"

import { MultiFormUser } from "./multiFormUser";

interface ActorFormProps {
  field: any;
  genre: AllCodeRow[];
}

export const ActorForm = ({
  field,
  genre
}: ActorFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <MultiFormUser
        label="Diễn viên"
        placeholder="Chọn diễn viên..."
        field={field}
        options={genre}
      />
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center justify-between gap-4 px-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <ListChecks size={20} />
            <span className="italic">
              {field.value.length} Diễn viên được chọn
            </span>
          </h4>
          {field.value.length > 0 && (
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="cursor-pointer"
              >
                <span className="flex items-center gap-1">
                  <ChevronsUpDown />
                  <span className="w-[66px]">
                    {isOpen ? "Thu gọn" : "Xem thêm"}
                  </span>
                </span>
              </Button>
            </CollapsibleTrigger>
          )}
        </div>
        <CollapsibleContent className="flex flex-col gap-2">
          {field.value.map((item: string) => (
            <div
              key={item}
              className="rounded-md border px-4 py-2 font-mono text-sm"
            >
              {item}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}