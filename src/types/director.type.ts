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
}

export interface UpdateDirectorDto {
  directorName?: string;
  birthDate?: string;
  genderCode?: string;
  story?: string;
  avatarUrl?: string;
  nationalityCode?: string;
}
