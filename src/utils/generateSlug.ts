export function generateSlug(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")      // bỏ dấu
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")         // bỏ ký tự đặc biệt
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
