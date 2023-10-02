import { randomBytes } from "crypto";
import { GROUP_EMAIL, PATH } from "../../constants";
import { User } from "../../types";
import { readFile } from "../../utils";

export async function createGroupHandler() {
  const existingUsers = await readFile<User[]>(PATH);
  const defaultUser = existingUsers.find(user => user.email === GROUP_EMAIL);
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
