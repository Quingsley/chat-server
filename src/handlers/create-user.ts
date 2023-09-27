import "@total-typescript/ts-reset";
import { PATH } from "../constants";
import { CustomError, User } from "../types";
import { getUsers, writeUsers } from "../utils";
import { createGroupHandler } from "./create-group";

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
        // create a default user for that user as a group
        const group = await createGroupHandler();
        group.contacts.push({ userId: data.userId }); // add userId as part of group contacts
        data.contacts.push({ userId: group.userId }); // add groupId as part of new user contacts
        users.push(data);
        //update the existingUsers also
        const existingGroupIndx = users.findIndex(u => u.email === group.email);
        if (existingGroupIndx >= 0) {
          users[existingGroupIndx] = group;
        } else {
          users.push(group); // no initial group
        }
        await writeUsers(PATH, users);
      }
    }
    return true;
  } catch (error) {
    throw error;
  }
}
