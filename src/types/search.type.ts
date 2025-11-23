export interface ISearchFilmResponse {
  films: IFilmSearch[];
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
  actorId: string;
  actorName: string;
}

export interface IDirectorSearch {
  directorId: string;
  directorName: string;
}

export interface IProducerSearch {
  producerId: string;
  producerName: string;
}