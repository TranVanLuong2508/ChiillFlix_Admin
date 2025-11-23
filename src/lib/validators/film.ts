import { ImageType } from "@/types/film.type";
import { z } from "zod"


const filmImageSchema = z.object({
  type: z.nativeEnum(ImageType),
  url: z.string(),
});

const actorSchema = z.object({
  actorId: z.string(),
  characterName: z.string(),
});

const directorSchema = z.object({
  directorId: z.string(),
  isMain: z.boolean(),
});

const producerSchema = z.object({
  producerId: z.string(),
  isMain: z.boolean(),
});

export const formSchema = z.object({
  originalTitle: z.string().min(2, {
    message: "Tên gốc phim không được bỏ trống",
  }),
  title: z.string().min(2, {
    message: "Tên phim không được bỏ trống",
  }),
  description: z.string().min(2, {
    message: "Mô tả không được bỏ trống",
  }),
  releaseDate: z.string().min(2, {
    message: "Ngày phát hành không được bỏ trống",
  }),
  year: z.string().min(2, {
    message: "Năm không được bỏ trống",
  }),
  slug: z.string().min(2, {
    message: "Slug không được bỏ trống",
  }),
  thumbUrl: z.string().min(2, {
    message: "ThumbURL không được bỏ trống",
  }),
  ageCode: z.string().min(2, {
    message: "Khối độ không được bỏ trống",
  }),
  duration: z.number().min(2, {
    message: "Thời lượng không được bỏ trống",
  }),
  typeCode: z.string().min(2, {
    message: "Loại không được bỏ trống",
  }),
  countryCode: z.string().min(2, {
    message: "Quốc gia không được bỏ trống",
  }),
  langCode: z.string().min(2, {
    message: "Ngôn ngữ không được bỏ trống",
  }),
  publicStatusCode: z.string().min(2, {
    message: "Trạng thái không được bỏ trống",
  }),
  directors: z.array(directorSchema).min(2, {
    message: "Vui lòng chọn đạo diễn",
  }),
  actors: z.array(actorSchema).min(2, {
    message: "Vui lòng chọn diễn viên",
  }),
  producers: z.array(producerSchema).min(2, {
    message: "Vui lòng chọn nhà sản xuất",
  }),
  genreCodes: z.array(z.string()).min(2, {
    message: "Thể loại không được bỏ trống",
  }),
  filmImages: z.array(filmImageSchema).min(3, {
    message: "Vui lòng upload đủ ảnh cần thiết",
  }),
});

