import { AllCodeRow } from "./backend.type"
import { Actor_FilmDetail } from "./actor.type"
import { Director_FilmDetail } from "./director.type"
import { Producer_FilmDetail } from "./producer.type"

export interface IUser_Film {
  userId: number;
  fullName: string;
  phoneNumber: string;
  avatarUrl: string;
  email: string;
}

export interface FilmColumn {
  filmId: string
  title: string
  originalTitle: string
  slug: string
  view: number
  isVip: boolean
  duration: number
  publicStatus: string
  createdAt: string
  updatedAt: string
  country: string
  language: string
}

export interface FilmDeletedColumn extends FilmColumn {
  deletedAt: string;
  deletedBy: IUser_Film
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
  isVip: boolean
  duration: number
  createdAt: string
  updatedAt: string

  publicStatus: IAllCodeRes
  country: IAllCodeRes
  language: IAllCodeRes
}

export interface IFilmDeletedPaginationRes extends IFilmPaginationRes {
  deletedAt: string;
  deletedBy: IUser_Film
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

export interface IFilmDeletedPagination {
  meta: {
    current: number
    pageSize: number
    pages: number
    total: number
  }
  result: IFilmDeletedPaginationRes[]
}


// Create New Film
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
  isVip: boolean;
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

export interface IFilmCreateRes {
  id: string;
  createdAt: string;
}
// Create New Film
// Delete Film 
export interface IFilmDeleteRes {
  id: string;
  deleted: boolean;
}
// Delete Film 

// Get Detail Film
export interface Film {
  filmId: string;
  originalTitle: string;
  title: string;
  duration: number;
  description: string;
  releaseDate: string;
  year: string;
  thumbUrl: string;
  slug: string;
  view: number;
  filmImages: FilmImage[];
  age: AllCodeRow;
  type: AllCodeRow;
  genres: AllCodeRow[];
  country: AllCodeRow;
  language: AllCodeRow;
  publicStatus: AllCodeRow;
}

export interface IFilmDetailRes {
  film: Film;
  directors: Director_FilmDetail[];
  actors: Actor_FilmDetail[];
  producers: Producer_FilmDetail[];
}

export interface FilmImagesRemake {
  backdrop: string;
  horizontal: string;
  poster: string;
}

export interface FilmDetail extends IFilmDetailRes {
  filmImages: FilmImagesRemake;
}

export interface FilmDataStream {
  film: Film;
  filmImages: FilmImagesRemake;
}

// Get Detail Film
// Retore Film 
export interface IFilmRestoreRes {
  restore: boolean;
}
// Retore Film 
// Hard delete
export interface IFilmHardDeleteRes {
  deleted: boolean;
}
// Hard delete
// Bulk Restore
export interface IFilmRestoreBulkRes {
  restoredCount: number,
  restoredIds: string[],
  restore: boolean,
}
// Bulk Restore

// Bulk Hard Delete
export interface IFilmHardDeleteBulkRes {
  deletedCount: number,
  deletedIds: string[],
  deleted: boolean,
}
// Bulk Hard Delete

