"use client";

import { useCallback, useMemo, useState } from "react";
import { ChevronsUpDown, ListChecks } from "lucide-react"
import { IDirectorSearch } from "@/types/search.type";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Search } from "./search";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface DirectorFormProps {
  field: any;
}

export const DirectorForm = ({
  field,
}: DirectorFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDirector, setSelectedDirector] = useState<IDirectorSearch[]>([]);

  const handleSelectDirector = (director: IDirectorSearch) => {
    const exists = field.value.some((item: any) => item.directorId === director.directorId);
    if (exists) return;

    const newDirectorEntry = {
      directorId: director.directorId,
      isMain: false,
    };

    if (field.value.length === 0) {
      newDirectorEntry.isMain = true;
    }

    field.onChange([...field.value, newDirectorEntry]);
    setSelectedDirector([...selectedDirector, director]);
  };

  const handleMainDirectorChange = useCallback(
    (directorId: number, isMain: boolean) => {
      const newValue = field.value.map((v: any) =>
        v.directorId === directorId ? { ...v, isMain } : v
      );
      field.onChange(newValue);
    },
    [field]
  );

  console.log(">>> check data director: ", field.value);

  return (
    <div className="flex flex-col gap-2">
      <FormItem className="flex-1">
        <FormLabel>Đạo diễn</FormLabel>
        <FormControl>
          <Search
            selectedDirector={selectedDirector}
            handleSelectDirector={handleSelectDirector}
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
              {selectedDirector.length} Đạo diễn được chọn
            </span>
          </h4>
          {selectedDirector.length > 0 && (
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
        <CollapsibleContent
          className="flex flex-col gap-2"
        >
          {selectedDirector.map((item: IDirectorSearch) => (
            <Label
              key={item.directorId}
              className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-amber-400 has-[[aria-checked=true]]:bg-amber-50 dark:has-[[aria-checked=true]]:border-amber-900 dark:has-[[aria-checked=true]]:bg-amber-950"
            >
              <Checkbox
                id="toggle-2"
                defaultChecked={field.value.find((v: any) => v.directorId === item.directorId)?.isMain}
                className="data-[state=checked]:border-amber-600 data-[state=checked]:bg-amber-600 data-[state=checked]:text-white dark:data-[state=checked]:border-amber-400 dark:data-[state=checked]:bg-amber-400"
                onCheckedChange={(checked) => handleMainDirectorChange(item.directorId, checked === true)}
              />
              <div className="grid gap-1.5 font-normal">
                <p className="text-sm leading-none font-medium">
                  {item.directorName}
                </p>
              </div>
            </Label>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}