import client from "../api/client";

export type UserRole = "admin" | "receptionist" | "employee";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export type CreateUserPayload = {
  email: string;
  fullName: string;
  role: UserRole;
  password: string;
};

export type UpdateUserPayload = Partial<CreateUserPayload>;

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await client.get("/users");
    return response.data;
  },

  createUser: async (payload: CreateUserPayload): Promise<User> => {
    const response = await client.post("/users", payload);
    return response.data;
  },

  updateUser: async (userId: string, payload: UpdateUserPayload): Promise<User> => {
    const response = await client.patch(`/users/${userId}`, payload);
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await client.delete(`/users/${userId}`);
    return response.data;
  },
};
