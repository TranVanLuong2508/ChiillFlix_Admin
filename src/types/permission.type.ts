export interface IPermissionn {
  permissionId: number;
  name: string;
  apiPath: string;
  method: string;
  module: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IPermissionData {
  permissions: IPermissionn[];
}

export interface PermissionModule {
  module: string;
  permissions: IPermissionn[];
}
