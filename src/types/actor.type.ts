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
  createdAt?: Date;
  updatedAt?: Date;

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
  createdAt: Date;
  updatedAt: Date;
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
  createdAt?: Date;
  updatedAt?: Date;

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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateActorDto {
  actorName?: string;
  birthDate?: string;
  genderCode?: string;
  shortBio?: string;
  avatarUrl?: string;
  nationalityCode?: string;
  updatedAt?: Date;
}

export interface Actor_FilmDetail {
  actorId: number;
  actorName: string;
  birthDate: string | null;
  avatarUrl: string;
  slug: string;
  shortBio: string | null;
  nationalityCode: string | null;
  genderCode: string | null;
  characterName: string;
}
