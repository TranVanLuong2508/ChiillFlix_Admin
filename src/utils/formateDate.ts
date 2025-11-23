import { format } from "date-fns"

export function formatDate(isoString?: string | null | Date) {
  if (!isoString) return ""

  try {
    return format(new Date(isoString), "dd/MM/yyyy")
  } catch {
    return ""
  }
}

export function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}