import { PATH } from "../constants";
import { User } from "../types";
import { getUsers } from "../utils";

export async function getUserHandler(email: string) {
  const existingUsers = await getUsers<User[]>(PATH);
  const user = existingUsers.find(user => user.email === email);
  if (user) return user;
}
