import { ALL_CODE_TYPES } from "@/constants/allCode";
import publicAxios from "@/lib/axios/publicAxios";
import { IBackendRes, ICountryData, IGenderData, IGenreData } from "@/types/backend.type";

export const allCodeService = {
  getCountriesList: () => {
    return publicAxios.get(`/all-codes/type/get-by-type?type=${ALL_CODE_TYPES.COUNTRY}`) as Promise<
      IBackendRes<ICountryData>
    >;
  },

  getGendersList: () => {
    return publicAxios.get(`/all-codes/type/get-by-type?type=GENDER`) as Promise<IBackendRes<IGenderData>>;
  },
};
