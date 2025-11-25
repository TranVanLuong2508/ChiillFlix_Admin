export interface IProducer {
  producerId: number,
  producerName: string,
  slug: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
  createdBy: number,
  updatedBy: number,
  deletedBy: number
}

export interface Producer_FilmDetail {
  producerId: number,
  producerName: string,
  slug: string,
  isMain: boolean,
}