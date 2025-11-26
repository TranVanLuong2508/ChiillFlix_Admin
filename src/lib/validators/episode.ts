import z from "zod";

export const formEpisodeSchema = z.object({
  title: z.string(),
  episodeNumber: z.string().min(1, {
    message: "Số thứ tự không được bỏ trống",
  }),
  slug: z.string().min(1, {
    message: "Mô tả không được bỏ trống",
  }),
  duration: z.string().min(1, {
    message: "Mô tả không được bỏ trống",
  }),
  videoUrl: z.string().min(1, {
    message: "Video URL không được bỏ trống",
  }),
  thumbUrl: z.string().min(1, {
    message: "Thumbnail URL không được bỏ trống",
  }),
})