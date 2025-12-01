export interface RatingColumn {
  ratingId: string;
  ratingValue: number;
  content: string;
  userName: string;
  userAvatar: string;
  userId: number;
  filmTitle: string;
  filmId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  isHidden: boolean;
}

export interface IRatingPagination {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  ratings: RatingColumn[];
}
