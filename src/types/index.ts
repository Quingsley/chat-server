export type IncomingUIUser = {
  userName: string;
  email: string;
  userId: string;
};
export interface User {
  name: string;
  email: string;
  id: string;
  contacts: Contacts[];
  chats: Chats[];
}

export enum Status {
  Success = "success",
  Failure = "failure",
}
export type Ack<T> = (data: { status: Status; message: string; data: T }) => void;

export type Contacts = { userId: string };

export interface Chats {
  chatId: string;
  message: string;
  senderId: string;
  recipientId: string;
  sentAt: string;
  receivedAt: string;
  isRead: boolean;
}
