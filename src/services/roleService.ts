import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import { IRoleData } from "@/types/role.type";

export const RoleService = {
  CallFetchRolesList: (): Promise<IBackendRes<IRoleData>> => {
    return privateAxios.get(`/roles`);
  },
};
