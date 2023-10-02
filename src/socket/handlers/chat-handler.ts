import { Server } from "socket.io";
import { PATH, ROOM_PATH, getGroupId } from "../../constants";
import { Chat, Ack, User, Status } from "../../types";
import { readFile, writeToFile } from "../../utils";

export async function chatHandler(io: Server, data: Chat, cb: Ack<Chat>) {
  const group = await getGroupId();
  const rooms = await readFile<string[]>(ROOM_PATH);

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
  //add chat to group
  const index = users.findIndex(user => user.userId === data.recipientId && user.type === "public");
  if (index >= 0 && group) {
    group.chats.push(chat);
    users[index] = group;
    await writeToFile(PATH, users);
    io.to(group.userId).emit("group-chat", JSON.stringify(chat, null, 2));
  } else {
    //add chat to user
    const userIndex = users.findIndex(user => user.userId === data.senderId && user.type === "private");
    const recipientIndex = users.findIndex(user => user.userId === data.recipientId && user.type === "private");
    if (userIndex >= 0 && recipientIndex >= 0) {
      const sender = users[userIndex];
      const recipient = users[recipientIndex];
      if (sender && recipient) {
        sender.chats.push(chat);
        recipient.chats.push(chat);
        users[userIndex] = sender;
        users[recipientIndex] = recipient;
        await writeToFile(PATH, users); // saving the user's chat

        const recipientRoomId = rooms.find(r => r === recipient.email);
        const senderRoomId = rooms.find(r => r === sender.email);
        if (senderRoomId) io.to(senderRoomId).emit("private-chat", JSON.stringify(chat, null, 2));
        if (recipientRoomId) io.to(recipientRoomId).emit("private-chat", JSON.stringify(chat, null, 2));
      }
    }
  }
  cb({ status: Status.Success, message: "Chat received on the server", data: chat });
}
