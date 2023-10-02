import "@total-typescript/ts-reset";
import { PATH, ROOM_PATH } from "../../constants";
import { CustomError, User } from "../../types";
import { readFile, writeToFile } from "../../utils";
import { createGroupHandler } from "./create-group";

export async function createUserHandler(data: User) {
  console.log(data);
  let users: User[] = [];

  try {
    const existingUsers = await readFile<User[]>(PATH);
    if (Array.isArray(existingUsers)) {
      users = [...existingUsers];
      const existingUser = users.find(existingUser => existingUser.email === data.email);
      if (existingUser) throw new CustomError("User already exists", 400);
      else {
        // create a default user for that user as a group
        const group = await createGroupHandler();
        group.contacts.push({ userId: data.userId }); // add userId as part of group contacts
        data.contacts.push({ userId: group.userId }); // add groupId as part of new user contacts
        users.push(data);

        // create a room fo the user
        await createRoom(data.email);
        //update the existingUsers also
        const existingGroupIndx = users.findIndex(u => u.email === group.email);
        if (existingGroupIndx >= 0) users[existingGroupIndx] = group;
        else users.push(group); // no initial group

        await writeToFile(PATH, users);
      }
    }
    return true;
  } catch (error) {
    throw error;
  }
}

async function createRoom(roomName: string) {
  const rooms = await readFile<string[]>(ROOM_PATH);
  const isRoomAvailable = rooms.find(r => r == roomName);
  if (isRoomAvailable) return;
  rooms.push(roomName);
  await writeToFile(ROOM_PATH, rooms);
}
