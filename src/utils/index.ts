import fs from "fs/promises";
import { User } from "../types";

export async function readFile<T>(path: string): Promise<T> {
  try {
    const file = await fs.readFile(path, "utf-8");
    const data = JSON.parse(file) as User[];

    return data as T;
  } catch (error) {
    throw error;
  }
}

export async function writeToFile<T>(path: string, data: T): Promise<void> {
  try {
    const json = JSON.stringify(data, null, 2);
    await fs.writeFile(path, json);
    console.log("data added");
  } catch (error) {
    throw error;
  }
}
