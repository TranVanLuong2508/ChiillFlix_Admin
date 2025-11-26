export interface Producer {
  producerId: number;
  producerName: string;
  slug: string;
  updatedBy?: number;
}

export interface ProducerColumn {
  producerId: string;
  producerName: string;
  slug: string;
}

export interface ProducerMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProducerListResponse {
  producers: Producer[];
  meta: ProducerMeta;
}

interface IProducerRes {
  producerId: number;
  producerName: string;
  slug: string;
  updatedBy?: number;
}

export interface IProducerPagination {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  producers: IProducerRes[];
}

export interface CreateProducerDto {
  producerName: string;
}

export interface UpdateProducerDto {
  producerName?: string;
}

export interface IProducer {
  producerId: number;
  producerName: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: number;
  updatedBy: number;
  deletedBy: number;
}

export interface Producer_FilmDetail {
  producerId: number;
  producerName: string;
  slug: string;
  isMain: boolean;
}
