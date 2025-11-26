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

interface MultiSelectFormProps {
  label: string;
  placeholder?: string;
  field: any;
  options: AllCodeRow[];
}

export const MultiFormUser = ({
  label,
  placeholder = "Chọn...",
  field,
  options,
}: MultiSelectFormProps) => {
  const [open, setOpen] = useState(false);

  return (
    <FormItem className="flex-1">
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {field.value.length > 0
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
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
