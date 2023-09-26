import fs from "fs/promises";
import { User } from "../types";

export async function getUsers<T>(path: string): Promise<T> {
  const file = await fs.readFile(path, "utf-8");
  const users = JSON.parse(file) as User[];

  return users as T;
}

export async function writeUsers<T>(path: string, data: T): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(path, json);
  console.log("data added");
}
