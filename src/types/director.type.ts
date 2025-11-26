export interface Director {
  directorId: number;
  directorName: string;
  slug: string;
  birthDate: string;
  genderCode: string;
  nationalityCode: string;
  story: string;
  avatarUrl: string;
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
  genderCodeRL?: {
    keyMap: string;
    type: string;
    valueVi: string;
    valueEn: string;
    description: string;
  };

  nationalityCodeRL?: {
    keyMap: string;
    type: string;
    valueVi: string;
    valueEn: string;
    description: string;
  };
}

export interface DirectorColumn {
  directorId: string;
  directorName: string;
  slug: string;
  birthDate: string;
  genderCode: string;
  nationalityCode: string;
  story: string;
  avatarUrl: string;
  gender: string;
  nationality: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DirectorMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DirectorListResponse {
  directors: Director[];
  meta: DirectorMeta;
}

interface IAllCodeRes {
  keyMap: string;
  type: string;
  valueEn: string;
  valueVi: string;
  description: string;
}

interface IDirectorRes {
  directorId: number;
  directorName: string;
  slug: string;
  birthDate: string;
  genderCode: string;
  nationalityCode: string;
  story: string;
  avatarUrl: string;
  updatedBy?: number;
  genderCodeRL?: IAllCodeRes;
  nationalityCodeRL?: IAllCodeRes;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDirectorPagination {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  directors: IDirectorRes[];
}

export interface CreateDirectorDto {
  directorName: string;
  birthDate?: string;
  genderCode?: string;
  story?: string;
  avatarUrl?: string;
  nationalityCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateDirectorDto {
  directorName?: string;
  birthDate?: string;
  genderCode?: string;
  story?: string;
  avatarUrl?: string;
  nationalityCode?: string;
  updatedAt?: Date;
}

export interface Director_FilmDetail {
  directorId: number;
  directorName: string;
  birthDate: string;
  story: string;
  slug: string;
  isMain: boolean;
  genderCode: string;
  nationalityCode: string;
  avatarUrl: string;
}
