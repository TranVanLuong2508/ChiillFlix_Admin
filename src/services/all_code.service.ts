
import publicAxios from "@/lib/axios/publicAxios";
import { IBackendRes } from "@/types/backend.type";
import { ALL_CODE_TYPES, IAllCodeResponse } from "@/types/all_code.type";

const baseURL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

const allCodeServie = {
  getByType: <T extends ALL_CODE_TYPES>(type: T) => {
    return publicAxios.get(
      `${baseURL}/all-codes/type/get-by-type?type=${type}`
    ) as Promise<IBackendRes<IAllCodeResponse<T>>>;
  },

  getAllCodeByType: (type: string) => {
    return publicAxios.get(`/all-codes/type/get-by-type?type=${type}`) as Promise<IBackendRes<any>>
  },
};

export default allCodeServie;
