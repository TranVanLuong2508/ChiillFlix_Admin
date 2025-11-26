export interface ISearchFilmResponse {
  films: IFilmSearch[];
}

export interface ISearchActorResponse {
  actors: IActorSearch[];
}

export interface ISearchDirectorResponse {
  directors: IDirectorSearch[];
}

export interface ISearchProducerResponse {
  producers: IProducerSearch[];
}

export interface IFilmSearch {
  filmId: string;
  title: string;
  originalTitle: string;
  thumbUrl: string;
  slug: string;
  year: string;
  description: string;
}

export interface IActorSearch {
  actorId: number;
  actorName: string;
}

export interface IDirectorSearch {
  directorId: number;
  directorName: string;
}

export interface IProducerSearch {
  producerId: number;
  producerName: string;
}