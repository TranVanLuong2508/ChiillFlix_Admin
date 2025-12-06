"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AllCodeRow } from "@/types/backend.type";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface MultiSelectFormProps {
  label: string;
  placeholder?: string;
  field: any;
  options: AllCodeRow[];
  message?: string;
}

export const MultiSelectForm = ({
  label,
  placeholder = "Chọn...",
  field,
  options,
  message = 'Trống',
}: MultiSelectFormProps) => {
  const [open, setOpen] = useState(false);

  return (
    <FormItem className="flex-1">
      <FormLabel>{label}<span className="text-red-500">*</span></FormLabel>
      <FormControl>
        <div className="flex flex-col gap-2">
          <ScrollArea className="max-h-[100px] border border-gray-200 p-2 rounded-lg">
            {field.value && field.value.length > 0 ? (
              <div className="flex items-center gap-2 flex-wrap">
                {
                  options.map((item) => field.value.includes(item.keyMap) && (
                    <Badge key={item.keyMap} variant={"outline"}>{item.valueVi}</Badge>
                  ))
                }
              </div>
            ) : (
              <span className="text-sm text-gray-500">{message}</span>
            )}
          </ScrollArea>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {field.value && field.value.length > 0
                  ? `${field.value.length} mục đã chọn`
                  : placeholder}
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" side="left">
              <Command>
                <CommandInput placeholder="Tìm..." />
                <CommandEmpty>Không có kết quả.</CommandEmpty>

                <CommandGroup>
                  {options.map((item) => (
                    <CommandItem
                      key={item.keyMap}
                      onSelect={() => {
                        if (field.value.includes(item.keyMap)) {
                          field.onChange(
                            field.value.filter((val: string) => val !== item.keyMap)
                          );
                        } else {
                          field.onChange([...field.value, item.keyMap]);
                        }
                      }}
                    >
                      <Checkbox
                        className="mr-2 data-[state=checked]:bg-transparent"
                        checked={field.value.includes(item.keyMap)}
                      />
                      {item.valueVi}
                      {field.value.includes(item.keyMap) && (
                        <Check className="ml-auto h-4 w-4 text-amber-400" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
