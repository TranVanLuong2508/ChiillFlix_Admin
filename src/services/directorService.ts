import publicAxios from "@/lib/axios/publicAxios";
import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import { IDirectorPagination, Director } from "@/types/director.type";

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

export const directorService = {
  getAllDirectors: (
    page: number = 1,
    limit: number = 10,
    sort?: string,
    filter?: Record<string, any>,
  ): Promise<IBackendRes<IDirectorPagination>> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (sort) {
      params.append("sort", sort);
    }

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
    }

    return publicAxios.get(`/director/get-all-directors?${params.toString()}`);
  },

  getDirectorById: (directorId: number): Promise<IBackendRes<Director>> => {
    return publicAxios.get(`/director/get-director-by-id/${directorId}`);
  },

  createDirector: (dto: CreateDirectorDto): Promise<IBackendRes<Director>> => {
    return privateAxios.post("/director/create-director", dto);
  },

  updateDirector: (directorId: number, dto: UpdateDirectorDto): Promise<IBackendRes<Director>> => {
    return privateAxios.patch(`/director/edit-director/${directorId}`, dto);
  },

  deleteDirector: (directorId: number): Promise<IBackendRes<any>> => {
    return privateAxios.delete(`/director/delete-director-by-id/${directorId}`);
  },
};
