import { Socket } from "socket.io";
import { readFile, writeToFile } from "../../utils";
import { ROOM_PATH } from "../../constants";

export async function authMiddleware(socket: Socket, next: () => void) {
  const token: string = socket.handshake.auth.token;
  console.log("user: " + token);
  if (!token) {
    return;
  }
  const rooms = await readFile<string[]>(ROOM_PATH);
  const isRoomAvailable = rooms.find(r => r === token);
  if (!isRoomAvailable) {
    //save room
    rooms.push(token);
    await writeToFile(ROOM_PATH, rooms);
  }
  socket.join(token); // joining the logged in user to their own room
  next();
}
