import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import { IUserCreate, IUserUpdate, UserData } from "@/types/user.type";

const UserService = {
  CallGetAllUserList: (): Promise<IBackendRes<UserData>> => {
    return privateAxios.get("/users");
  },

  CallCreateUser: (payload: IUserCreate): Promise<IBackendRes<{ userId: number, createdAt: string }>> => {
    return privateAxios.post("/users", payload);
  },

  CallUpdateUser: (payload: IUserUpdate): Promise<IBackendRes<{ userId: number, updatedAt: string }>> => {
    return privateAxios.patch(`/users/update`, payload);
  },

  CallDeleteUser: (userId: number): Promise<IBackendRes<{ userId: number }>> => {
    return privateAxios.delete(`/users/${userId}`);
  },
};

export default UserService;
