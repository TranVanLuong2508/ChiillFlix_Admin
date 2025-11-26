import z from "zod";

export const formPartSchema = z.object({
  title: z.string().min(1, {
    message: "Tên phim không được bỏ trống",
  }),
  partNumber: z.string().min(1, {
    message: "Số thứ tự không được bỏ trống",
  }),
  description: z.string().min(1, {
    message: "Mô tả không được bỏ trống",
  }),
})