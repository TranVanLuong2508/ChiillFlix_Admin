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
