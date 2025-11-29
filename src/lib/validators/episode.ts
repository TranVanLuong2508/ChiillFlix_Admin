import z from "zod";

export const formEpisodeSchema = z.object({
  title: z.string().min(1, {
    message: "Tiêu đề không được bỏ trống",
  }),
  duration: z
    .number()
    .positive({ message: "Thời lượng phải lớn hơn 0" })
    .min(1, { message: "Thời lượng tối thiểu là 1 phút" }),
  videoUrl: z.string().min(1, {
    message: "Video URL không được bỏ trống",
  }),
  thumbUrl: z.string().min(1, {
    message: "Thumbnail URL không được bỏ trống",
  })
})