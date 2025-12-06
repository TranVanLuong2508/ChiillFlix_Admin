"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ChevronsUpDown, CircleMinus, ListChecks } from "lucide-react";
import { IActorSearch } from "@/types/search.type";

import {
  FormControl,
  FormDescription,
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
import { Input } from "@/components/ui/input";

import { Search } from "./search";
import { useFilmStore } from "@/stores/film.store";

interface ActorFormProps {
  field: any;
}

export const ActorForm = ({
  field,
}: ActorFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedActor, setSelectedActor] = useState<IActorSearch[]>([]);
  const { filmDetailRaw } = useFilmStore();

  useEffect(() => {
    if (!filmDetailRaw || field.value.length === 0) return;
    handleDataUpdate();
  }, [filmDetailRaw]);

  const handleDataUpdate = () => {
    if (!filmDetailRaw) return;
    const actors = filmDetailRaw.actors;
    const dataActorSelected = actors.map((actor: any): IActorSearch => ({
      actorId: actor.actorId,
      actorName: actor.actorName,
    }));
    setSelectedActor(dataActorSelected);
  }

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

  const handleCharacterNameChange = useCallback(
    (actorId: number, characterName: string) => {
      const newValue = field.value.map((v: any) =>
        v.actorId === actorId ? { ...v, characterName } : v
      );
      field.onChange(newValue);
    },
    [field]
  );

  const handleRemoveActor = useCallback(
    (actorId: number) => {
      const newValue = field.value.filter((v: any) => v.actorId !== actorId);
      field.onChange(newValue);
      setSelectedActor(selectedActor.filter((v: any) => v.actorId !== actorId));
    },
    [field, selectedActor]
  );

  return (
    <div className="flex flex-col gap-2">
      <FormItem className="flex-1">
        <FormLabel>Diễn viên<span className="text-red-500">*</span></FormLabel>
        <FormControl>
          <Search
            selectedActor={selectedActor}
            handleSelectActor={handleSelectActor}
          />
        </FormControl>
        <FormMessage />
        <div className="text-muted-foreground text-sm space-y-2">
          <p className="text-sm italic font-semibold">Lưu ý: </p>
          <ul className="list-decimal pl-8">
            <li>Chỉ được chọn tối đa 5 diễn viên chính.</li>
            <li>Vui lòng kiểm tra và nhập tên nhân vật mà diễn viên đóng.</li>
          </ul>
        </div>
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
              className="rounded-md border px-4 py-2 font-mono text-sm flex flex-col gap-2 min-w-[300px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">
                  {item.actorName}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer"
                  onClick={() => handleRemoveActor(item.actorId)}
                  type="button"
                >
                  <CircleMinus />
                </Button>
              </div>
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