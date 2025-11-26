import { format } from "date-fns";

export function formatDate(isoString?: string | null) {
  if (!isoString) return "";

  try {
    return format(new Date(isoString), "HH:mm:ss dd/MM/yyyy");
  } catch {
    return "";
  }
}

export function formatDateTime(isoString?: string | null) {
  if (!isoString) return "";

  try {
    return format(new Date(isoString), "HH:mm:ss dd/MM/yyyy");
  } catch {
    return "";
  }
}

export function formatbirthDate(isoString?: string | null) {
  if (!isoString) return "";

  try {
    return format(new Date(isoString), "dd/MM/yyyy");
  } catch {
    return "";
  }
}
