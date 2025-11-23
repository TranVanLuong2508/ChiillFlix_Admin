export interface FilmColumn {
  filmId: string
  title: string
  originalTitle: string
  slug: string
  view: number
  duration: number
  publicStatus: string
  createdAt: string
  updatedAt: string
  country: string
  language: string
}

interface IAllCodeRes {
  keyMap: string
  valueEn: string
  valueVi: string
  description?: string
}

export interface IFilmPaginationRes {
  filmId: string
  title: string
  originalTitle: string
  slug: string
  view: number
  duration: number
  createdAt: string
  updatedAt: string
  publicStatus: IAllCodeRes
  country: IAllCodeRes
  language: IAllCodeRes
}

export interface IFilmPagination {
  meta: {
    current: number
    pageSize: number
    pages: number
    total: number
  }
  result: IFilmPaginationRes[]
}


// Create New Film Request
export enum ImageType {
  POSTER = 'poster',
  HORIZONTAL = 'horizontal',
  BACKDROP = 'backdrop'
}

export interface FilmImage {
  type: ImageType;
  url: string;
}

export interface Director {
  directorId: number;
  isMain: boolean;
}

export interface Actor {
  actorId: number;
  characterName: string;
}

export interface Producer {
  producerId: number;
  isMain: boolean;
}

export interface IFilmCreateReq {
  originalTitle: string;
  title: string;
  description: string;
  releaseDate: string;
  year: string;
  slug: string;
  thumbUrl: string;
  ageCode: string;
  duration: number;
  typeCode: string;
  genreCodes: string[];
  countryCode: string;
  langCode: string;
  publicStatusCode: string;
  filmImages: FilmImage[];
  directors: Director[];
  actors: Actor[];
  producers: Producer[];
}