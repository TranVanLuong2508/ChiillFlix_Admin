import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import { UserData } from "@/types/user.type";

const UserService = {
  CallGetAllUserList: (): Promise<IBackendRes<UserData>> => {
    return privateAxios.get("/users");
  },
};

export default UserService;
