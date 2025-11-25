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

export interface ModalRoleData {
  roleName: string;
  description: string;
  isActive: boolean;
  permissionIds: number[];
}

export interface IReturnRole {
  roleId: number;
  roleName: string;
}

export interface CheckRole {
  userCount: number;
  alternativeRoles: IReturnRole[];
}

export interface IAssignData {
  roleId: number;
  targetRoleId: number;
}

export type filteType = "all" | "active" | "deleted";
