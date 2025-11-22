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