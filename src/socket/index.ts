import { Server, Socket } from "socket.io";
import { getGroupId } from "../constants";
import { Ack, Chat } from "../types";
import { chatHandler } from "./handlers/chat-handler";

export async function socketHandler(socket: Socket, io: Server) {
  console.log(`a user connected with id ${socket.id}`);
  const group = await getGroupId();

  if (group) socket.join(group.userId);

  socket.on("chat", async (data: Chat, cb: Ack<Chat>) => chatHandler(io, data, cb));

  socket.on("join", data => {
    console.log(data);
    socket.broadcast.emit("new-contact-added", "Refresh your contacts"); // helps connected clients to refresh their contacts // but need to figure out how to send to only the recipient
  });

  socket.on("disconnect", reason => {
    console.log(`client ${socket.id} disconnected because ${reason}`);
  });
  socket.on("disconnecting", () => {
    console.log(socket.rooms);
  });

  socket.on("error", err => {
    console.log("received error from client:", socket.id);
    console.log(err);
  });
}
