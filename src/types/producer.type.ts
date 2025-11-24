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