import client from "../api/client";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export interface GetUsersRequest {
  users: User[];
}

export const userService = {
  getAllUsers: async () => {
    const response = await client.get("/users");
    return response.data;
  },
};
