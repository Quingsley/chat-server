import { Server } from "socket.io";
import { PATH, getGroupId } from "../../constants";
import { Chat, Ack, User, Status } from "../../types";
import { readFile, writeToFile } from "../../utils";

export async function chatHandler(io: Server, data: Chat, cb: Ack<Chat>) {
  const group = await getGroupId();
  console.log(data);
  const offset = new Date().getTimezoneOffset();
  const chat: Chat = {
    messageLabel: data.messageLabel,
    chatId: data.chatId,
    message: data.message,
    senderId: data.senderId,
    recipientId: data.recipientId,
    sentAt: data.sentAt,
    receivedAt: new Date(Date.now() - offset * 60 * 1000).toISOString(),
    isRead: false,
  };

  const users = await readFile<User[]>(PATH);
  const index = users.findIndex(user => user.userId === data.recipientId);
  if (index >= 0 && group) {
    group.chats.push(chat);
    users[index] = group;
    await writeToFile(PATH, users);
    io.to(group.userId).emit("group-chat", JSON.stringify(chat, null, 2));
  }

  cb({ status: Status.Success, message: "Chat received on the server", data: chat });
}
