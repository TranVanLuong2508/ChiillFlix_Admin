import z from "zod";

export const formPartSchema = z.object({
  title: z.string().min(1, {
    message: "Tên phim không được bỏ trống",
  }),
  description: z
    .string()
    .max(1200, {
      message: "Mô tả không được vượt quá 1200 ký tự",
    }),
})