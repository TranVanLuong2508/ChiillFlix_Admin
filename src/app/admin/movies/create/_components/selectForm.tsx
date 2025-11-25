"use client";

import { AllCodeRow } from "@/types/backend.type";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectFormProps {
  label: string;
  placeholder: string;
  field: any;
  selectOption: AllCodeRow[];
}

export const SelectForm = ({
  label,
  placeholder,
  field,
  selectOption,
}: SelectFormProps) => {

  return (
    <FormItem className="flex-1">
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {
              selectOption.map((item) => (
                <SelectItem
                  key={item.id}
                  value={item.keyMap}
                >
                  {item.valueVi}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};