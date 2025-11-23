import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import { ModalRoleData, IRole, IRoleData } from "@/types/role.type";

export const RoleService = {
  CallFetchRolesList: (): Promise<IBackendRes<IRoleData>> => {
    return privateAxios.get(`/roles`);
  },

  CallCreateRole: (roleData: ModalRoleData): Promise<IBackendRes<IRole>> => {
    return privateAxios.post("/roles", roleData);
  },

  CallGetRoleDetail: (roleId: number): Promise<IBackendRes<IRole>> => {
    return privateAxios.get(`/roles/get-by-id/${roleId}`);
  },

  CallUpdateRole: (roleId: number, payload: ModalRoleData) => {
    return privateAxios.patch(`/roles/${roleId}`, payload);
  },
};
