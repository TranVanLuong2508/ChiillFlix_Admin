"use client";

import { useCallback, useState } from "react";
import { ChevronsUpDown, ListChecks } from "lucide-react"
import { IProducerSearch } from "@/types/search.type";

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

import { Search } from "./search";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ProducerFormProps {
  field: any;
}

export const ProducerForm = ({
  field,
}: ProducerFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProducer, setSelectedProducer] = useState<IProducerSearch[]>([]);

  const handleSelectProducer = (producer: IProducerSearch) => {
    const exists = field.value.some((item: any) => item.producerId === producer.producerId);
    if (exists) return;

    const newProducerEntry = {
      producerId: producer.producerId,
      isMain: false,
    };

    if (field.value.length === 0) {
      newProducerEntry.isMain = true;
    }

    field.onChange([...field.value, newProducerEntry]);
    setSelectedProducer([...selectedProducer, producer]);
  };

  const handleMainProducerChange = useCallback(
    (producerId: number, isMain: boolean) => {
      const newValue = field.value.map((v: any) =>
        v.producerId === producerId ? { ...v, isMain } : v
      );
      field.onChange(newValue);
    },
    [field]
  );

  console.log(">>> check data producer: ", field.value);

  return (
    <div className="flex flex-col gap-2">
      <FormItem className="flex-1">
        <FormLabel>Nhà sản xuất</FormLabel>
        <FormControl>
          <Search
            selectedProducer={selectedProducer}
            handleSelectProducer={handleSelectProducer}
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
              {selectedProducer.length} Nhà sản xuất được chọn
            </span>
          </h4>
          {selectedProducer.length > 0 && (
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
          {selectedProducer.map((item: IProducerSearch) => (
            <Label
              key={item.producerId}
              className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-amber-400 has-[[aria-checked=true]]:bg-amber-50 dark:has-[[aria-checked=true]]:border-amber-900 dark:has-[[aria-checked=true]]:bg-amber-950"
            >
              <Checkbox
                id="toggle-2"
                defaultChecked={field.value.find((v: any) => v.producerId === item.producerId)?.isMain}
                className="data-[state=checked]:border-amber-600 data-[state=checked]:bg-amber-600 data-[state=checked]:text-white dark:data-[state=checked]:border-amber-400 dark:data-[state=checked]:bg-amber-400"
                onCheckedChange={(checked) => handleMainProducerChange(item.producerId, checked === true)}
              />
              <div className="grid gap-1.5 font-normal">
                <p className="text-sm leading-none font-medium">
                  {item.producerName}
                </p>
              </div>
            </Label>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}