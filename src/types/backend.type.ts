export interface IBackendRes<T> {
  EC: number;
  EM: string;
  data?: T;
  message: string;
  statusCode: string;
}

export interface IGenreData {
  GENRE: AllCodeRow[];
  statusCode?: number;
}

export interface ICountryData {
  COUNTRY: AllCodeRow[];
  statusCode?: number;
}

export interface IGenderData {
  GENDER: AllCodeRow[];
  statusCode?: number;
}

export interface AllCodeRow {
  id: number;
  keyMap: string;
  valueEn: string;
  valueVi: string;
  description: string;
}
