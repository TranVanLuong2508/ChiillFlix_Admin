import privateAxios from "@/lib/axios/privateAxios";
import publicAxios from "@/lib/axios/publicAxios";
import { Actor, CreateActorDto, IActorPagination, UpdateActorDto } from "@/types/actor.type";
import { IBackendRes } from "@/types/backend.type";

export const actorService = {
  getAllActors: (
    page: number = 1,
    limit: number = 10,
    sort?: string,
    filter?: Record<string, any>,
  ): Promise<IBackendRes<IActorPagination>> => {
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
    return privateAxios.get(`/actor/all-actors?${params.toString()}`);
  },
  getActorById: (actorId: number): Promise<IBackendRes<Actor>> => {
    return publicAxios.get(`/actor/get-actor-by-id/${actorId}`);
  },

  createActor: (dto: CreateActorDto): Promise<IBackendRes<Actor>> => {
    return privateAxios.post("/actor/create-actor", dto);
  },

  updateActor: (actorId: number, dto: UpdateActorDto): Promise<IBackendRes<Actor>> => {
    return privateAxios.patch(`/actor/update-actor/${actorId}`, dto);
  },

  deleteActor: (actorId: number): Promise<IBackendRes<any>> => {
    return privateAxios.delete(`/actor/delete-actor-by-id/${actorId}`);
  },
};
