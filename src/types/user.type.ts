export interface IUser {
  userId: number;
  email: string;
  fullName: string;
  roleId: number;
  genderCode: string;
  isVip: boolean;
  statusCode: string;
  permissions?: {
    name: string;
    apiPath: string;
    method: string;
    module: string;
  }[];
}
