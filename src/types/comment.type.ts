export interface User {
  userId: number;
  fullName: string;
  avatarUrl: string;
}

export interface Film {
  filmId: string;
  title: string;
  slug: string;
}

export interface Comment {
  commentId: string;
  content: string;
  isHidden: boolean;
  totalLike: number;
  totalDislike: number;
  totalChildrenComment: number;
  user: User;
  film: Film;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CommentColumn {
  commentId: string;
  content: string;
  isHidden: boolean;
  totalLike: number;
  totalDislike: number;
  totalChildrenComment: number;
  userName: string;
  userAvatar: string;
  filmTitle: string;
  filmId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ICommentRes {
  commentId: string;
  content: string;
  isHidden: boolean;
  totalLike: number;
  totalDislike: number;
  totalChildrenComment: number;
  user: User;
  film: Film;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentPagination {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  comments: ICommentRes[];
}

export interface UpdateCommentDto {
  content?: string;
  isHidden?: boolean;
}
