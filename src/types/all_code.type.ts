import { AllCodeRow } from "./backend.type";

export enum ALL_CODE_TYPES {
  VERSION = 'VERSION',
  GENRE = 'GENRE',
  RANK = 'RANK',
  FILM_TYPE = 'FILM_TYPE',
  COUNTRY = 'COUNTRY',

  FILM_STATUS = 'FILM_STATUS',

  STATUS = 'STATUS',
  YEAR = 'YEAR',
  SORT = 'SORT',
  ROLE = 'ROLE',
  USER_STATUS = 'USER_STATUS',
  GENDER = 'GENDER',
}

export type IAllCodeResponse<T extends string> = {
  [key in T]: AllCodeRow[];
}