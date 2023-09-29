import { PATH } from "../../constants";
import { User } from "../../types";
import { readFile } from "../../utils";

export async function getUserHandler(email: string) {
  const existingUsers = await readFile<User[]>(PATH);
  const user = existingUsers.find(user => user.email === email);
  if (user) return user;
}
