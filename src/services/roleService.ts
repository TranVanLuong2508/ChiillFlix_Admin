import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import { createRoleData, IRole, IRoleData } from "@/types/role.type";

export const RoleService = {
  CallFetchRolesList: (): Promise<IBackendRes<IRoleData>> => {
    return privateAxios.get(`/roles`);
  },

  CallCreateRole: (roleData: createRoleData): Promise<IBackendRes<IRole>> => {
    return privateAxios.post("/roles", roleData);
  },
};
