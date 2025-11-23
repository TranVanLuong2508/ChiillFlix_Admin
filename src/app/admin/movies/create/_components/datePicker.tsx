import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { formatDate, isValidDate } from "@/utils/formateDate";
import { useState } from "react"

interface IDatePicker {
  field: any
}

export const DatePicker = ({ field }: IDatePicker) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative flex gap-2">
      <Input
        id="date"
        value={field.value ? formatDate(field.value) : ""}
        placeholder={formatDate(new Date())}
        className="pr-10"
        onChange={(e) => {
          const date = new Date(e.target.value)
          if (isValidDate(date)) {
            field.onChange(date?.toISOString())
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault()
            setOpen(true)
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-picker"
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
          >
            <CalendarIcon className="size-3.5" />
            <span className="sr-only">Select date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={field.value ? new Date(field.value) : undefined}
            captionLayout="dropdown"
            onSelect={(date: any) => {
              field.onChange(date?.toISOString())
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}