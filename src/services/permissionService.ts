import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import { IPermissionCreate, IPermissionData, IPermissionn, IPermissionUpdate } from "@/types/permission.type";

export const PermmissionService = {
  CallFetchPermissionList: (): Promise<IBackendRes<IPermissionData>> => {
    return privateAxios.get(`/permissions`);
  },

  CallCreatePermission: (payload: IPermissionCreate): Promise<IBackendRes<{ permissionId: number, createAt: string }>> => {
    return privateAxios.post(`/permissions`, payload);
  },

  CallGetPermissionDetail: (permissionId: number): Promise<IBackendRes<any>> => {
    return privateAxios.get(`/permissions/${permissionId}`);
  },

  CallUpdatePermission: (permissionId: number, payload: IPermissionUpdate): Promise<IBackendRes<{ permissionId: number }>> => {
    return privateAxios.patch(`/permissions/${permissionId}`, payload);
  },

  CallDeletePermission: (permissionId: number): Promise<IBackendRes<{ permissionId: number }>> => {
    return privateAxios.delete(`/permissions/${permissionId}`);
  },
};
