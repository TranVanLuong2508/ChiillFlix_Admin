export interface IUser {
  userId: number;
  email: string;
  fullName: string;
  roleId: number;
  roleName: string;
  genderCode: string;
  isVip: boolean;
  statusCode: string;
  avatarUrl: string;
  permissions?: {
    name: string;
    apiPath: string;
    method: string;
    module: string;
  }[];
}

export interface IUserBasic {
  userId: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatarUrl: string;
  genderCode: string;
  age: number;
  roleId: number;
  birthDate: string;
  isVip: boolean;
  statusCode: string;
  vipExpireDate: string;
  refreshToken: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  createdBy: string;
  updatedBy: string;
  deletedBy: string;
}

export interface UserData {
  users: IUserBasic[];
}

export interface IUserCreate {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  age: number;
  genderCode: string;
  roleId: number;
}

export interface IUserUpdate {
  userId: number;
  fullName: string;
  phoneNumber: string;
  age: number;
  genderCode: string;
  roleId: number;
}
