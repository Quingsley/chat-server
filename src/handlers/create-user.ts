import "@total-typescript/ts-reset";
import { PATH } from "../constants";
import { CustomError, User } from "../types";
import { getUsers, writeUsers } from "../utils";

export async function createUserHandler(data: User) {
  console.log(data);
  let users: User[] = [];

  try {
    const existingUsers = await getUsers<User[]>(PATH);
    if (Array.isArray(existingUsers)) {
      users = [...existingUsers];
      const existingUser = users.find(existingUser => existingUser.email === data.email);
      if (existingUser) {
        throw new CustomError("User already exists", 400);
      } else {
        users.push(data);
        await writeUsers(PATH, users);
      }
    }
    return true;
  } catch (error) {
    throw error;
  }
}
