import { User } from "../types";
import { readFile } from "../utils";

export const PATH = "./src/data/user.json";
export const ROOM_PATH = "./src/data/rooms.json";
export const GROUP_EMAIL = "group@group.com";

export async function getGroupId() {
  const users = await readFile<User[]>(PATH);
  const group = users.find(user => user.email === GROUP_EMAIL);
  return group;
}
