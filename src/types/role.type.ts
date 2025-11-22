export interface IRole {
  roleId: number;
  roleName: string;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IRoleData {
  roles: IRole[];
}
