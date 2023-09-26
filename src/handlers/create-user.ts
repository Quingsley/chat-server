import "@total-typescript/ts-reset";
import { Ack, User, Status, IncomingUIUser } from "../types";
import { getUsers, writeUsers } from "../utils";
import { PATH } from "../constants";

export async function createUserHandler(data: IncomingUIUser, ack: Ack<User>) {
  console.log(data);
  let users: User[] = [];
  const user: User = {
    name: data.userName,
    email: data.email,
    id: data.userId,
    contacts: [],
    chats: [],
  };

  const existingUsers = await getUsers<User[]>(PATH);
  if (Array.isArray(existingUsers)) {
    users = [...existingUsers];
    const existingUser = users.find(existingUser => existingUser.email === data.email);
    if (existingUser) {
      ack({ status: Status.Failure, message: "user already exists", data: user });
      return;
    } else {
      users.push(user);
      await writeUsers(PATH, users);
      ack({ status: Status.Success, message: "user created successfully", data: user });
    }
  }
}
