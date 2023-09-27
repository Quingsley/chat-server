import { randomBytes } from "crypto";
import { GROUP_EMAIL, PATH } from "../constants";
import { User } from "../types";
import { getUsers, writeUsers } from "../utils";

export async function createGroupHandler() {
  const existingUsers = await getUsers<User[]>(PATH);
  const defaultUser = existingUsers.find(user => user.email === "group@group.com");
  if (!defaultUser) {
    const defaultGroup: User = {
      type: "public",
      userName: "Group A",
      email: GROUP_EMAIL,
      userId: randomBytes(10).toString("hex"),
      contacts: [],
      chats: [],
    };
    return defaultGroup;
  }
  return defaultUser;
}
