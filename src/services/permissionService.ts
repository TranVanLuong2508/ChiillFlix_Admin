import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import { IPermissionData } from "@/types/permission.type";

export const PermmissionService = {
  CallFetchPermissionList: (): Promise<IBackendRes<IPermissionData>> => {
    return privateAxios.get(`/permissions`);
  },
};
