"use client";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { Search } from "./search";
import { ChevronsUpDown, ListChecks } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { IActorSearch } from "@/types/search.type";
import { Input } from "@/components/ui/input";

interface ActorFormProps {
  field: any;
}

export const ActorForm = ({
  field,
}: ActorFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedActor, setSelectedActor] = useState<IActorSearch[]>([]);

  const handleSelectActor = (actor: IActorSearch) => {
    const exists = field.value.some((item: any) => item.actorId === actor.actorId);
    if (exists) return;

    const newActorEntry = {
      actorId: actor.actorId,
      characterName: "",
    };

    field.onChange([...field.value, newActorEntry]);
    setSelectedActor([...selectedActor, actor]);
  };


  const valueMap = useMemo(
    () => new Map(field.value.map((v: any) => [v.actorId, v.characterName])),
    [field.value]
  );

  const handleCharacterNameChange = useCallback(
    (actorId: number, characterName: string) => {
      const newValue = field.value.map((v: any) =>
        v.actorId === actorId ? { ...v, characterName } : v
      );
      field.onChange(newValue);
    },
    [field]
  );

  return (
    <div className="flex flex-col gap-2">
      <FormItem className="flex-1">
        <FormLabel>Diễn viên</FormLabel>
        <FormControl>
          <Search
            selectedActor={selectedActor}
            handleSelectActor={handleSelectActor}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center justify-between gap-4 px-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <ListChecks size={20} />
            <span className="italic">
              {selectedActor.length} Diễn viên được chọn
            </span>
          </h4>
          {selectedActor.length > 0 && (
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
        <CollapsibleContent className="flex items-center flex-wrap gap-2">
          {selectedActor.map((item: IActorSearch) => (
            <div
              key={item.actorId}
              className="rounded-md border px-4 py-2 font-mono text-sm flex flex-col gap-2 w-[280px]"
            >
              <span className="text-sm font-semibold">
                {item.actorName}
              </span>
              <Input
                value={field.value.find((v: any) => v.actorId === item.actorId)?.characterName || ""}
                onChange={(e) => {
                  handleCharacterNameChange(item.actorId, e.target.value);
                }}
                placeholder="Tên nhân vật"
              />
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}