export interface IAllCodeRes {
  keyMap: string;
  type: string;
  valueEn: string;
  valueVi: string;
  description: string;
}

export interface Actor {
  actorId: number;
  actorName: string;
  slug: string;
  shortBio?: string;
  genderCode: string;
  birthDate: string;
  nationalityCode: string;
  avatarUrl: string;
  updatedBy?: number;

  genderActor?: IAllCodeRes;
  nationalityActor?: IAllCodeRes;
}

export interface ActorColumn {
  actorId: string;
  actorName: string;
  slug: string;
  shortBio: string;
  birthDate: string;
  genderCode: string;
  nationalityCode: string;
  avatarUrl: string;
  gender: string;
  nationality: string;
}

export interface ActorMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ActorListResponse {
  actors: Actor[];
  meta: ActorMeta;
}

export interface IActorRes {
  actorId: number;
  actorName: string;
  slug: string;
  shortBio?: string;
  birthDate: string;
  genderCode: string;
  nationalityCode: string;
  avatarUrl: string;
  updatedBy?: number;

  genderActor?: IAllCodeRes;
  nationalityActor?: IAllCodeRes;
}

export interface IActorPagination {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  actors: IActorRes[];
}

export interface CreateActorDto {
  actorName: string;
  birthDate?: string;
  genderCode?: string;
  shortBio?: string;
  avatarUrl?: string;
  nationalityCode?: string;
}

export interface UpdateActorDto {
  actorName?: string;
  birthDate?: string;
  genderCode?: string;
  shortBio?: string;
  avatarUrl?: string;
  nationalityCode?: string;
}
