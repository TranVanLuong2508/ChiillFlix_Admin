import { IEpisodeDetail } from "./episode.type";

export interface IPartDetail {
  id: string;
  title: string;
  partNumber: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  filmId: string;
}

interface IPartDetailEpisode extends IPartDetail {
  episodes: IEpisodeDetail[];

}

export interface IPartGetAll {
  partData: IPartDetail[];
}

export interface IPartGetAllEpisode {
  partData: IPartDetailEpisode[];
}

// create part
export interface IPartCreateReq {
  title: string;
  partNumber: number;
  description: string;
  filmId: string;
}

export interface IPartCreateRes {
  id: string;
  createdAt: string;
}
// create part
// update part
export interface IPartUpdateRes {
  affectedRows: number;
}
// update part
// delete part
export interface IPartDeleteRes {
  deleted: boolean;
}
// delete part

// table

export interface IPartColumn {
  id: string;
  title: string;
  partNumber: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  filmId: string;
}

// table