export interface IRole {
  roleId: number;
  roleName: string;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  rolePermission?: any;
}

export interface IRoleData {
  roles: IRole[];
}

export interface createRoleData {
  roleName: string;
  description: string;
  isActive: boolean;
  permissionIds: number[];
}
