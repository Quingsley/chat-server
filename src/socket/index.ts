import { Server, Socket } from "socket.io";
import { PATH, getGroupId } from "../constants";
import { Ack, Chats, Status, User } from "../types";
import { getUsers, writeUsers } from "../utils";

export async function socketHandler(socket: Socket, io: Server) {
  console.log(`a user connected with id ${socket.id}`);

  const group = await getGroupId();
  if (group) socket.join(group.userId);

  socket.on("chat", async (data: Chats, cb: Ack<Chats>) => {
    console.log(data);
    const offset = new Date().getTimezoneOffset();
    const chat: Chats = {
      chatId: data.chatId,
      message: data.message,
      senderId: data.senderId,
      recipientId: data.recipientId,
      sentAt: data.sentAt,
      receivedAt: new Date(Date.now() - offset * 60 * 1000).toISOString(),
      isRead: false,
    };

    const users = await getUsers<User[]>(PATH);
    const index = users.findIndex(user => user.userId === data.recipientId);
    if (index >= 0 && group) {
      group.chats.push(chat);
      users[index] = group;
      await writeUsers(PATH, users);
      io.to(group.userId).emit("group-chat", chat);
    }

    cb({ status: Status.Success, message: "Chat received on the server", data: chat });
    // socket.to(data.recipientId).emit("chat", chat);
  });

  socket.on("typing", data => {
    console.log(data);
  });

  socket.on("message", data => {
    console.log(data);
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
