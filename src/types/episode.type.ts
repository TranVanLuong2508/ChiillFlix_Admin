export interface IEpisodeDetail {
  id: string;
  title: string;
  episodeNumber: number;
  duration: number;
  videoUrl: string;
  thumbUrl: string;
}

export interface IEpisodeColumn {
  id: string;
  title: string;
  slug: string;
  episodeNumber: number;
  duration: number;
  videoUrl: string;
  thumbUrl: string;
  partId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IEpisodePagination {
  meta: {
    current: number
    pageSize: number
    pages: number
    total: number
  }
  result: IEpisodeColumn[]
}

// create episode
export interface ICreateEpisodeReq {
  title: string;
  episodeNumber: number;
  duration: number;
  videoUrl: string;
  thumbUrl: string;
  partId: string;
}

export interface ICreateEpisodeRes {
  id: string;
  createdAt: string;
}
// create episode
// update episode

export interface IUpdateEpisodeRes {
  message: string;
  affectedRows: number;
}

// update episode