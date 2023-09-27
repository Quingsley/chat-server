import { User } from "../types";
import { getUsers } from "../utils";

export const PATH = "./src/data/user.json";
export const GROUP_EMAIL = "group@group.com";

export async function getGroupId() {
  const users = await getUsers<User[]>(PATH);
  const group = users.find(user => user.email === GROUP_EMAIL);
  return group;
}
