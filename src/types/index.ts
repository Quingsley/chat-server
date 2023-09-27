export type IncomingUIUser = {
  userName: string;
  email: string;
  userId: string;
};
export interface User {
  type: "private" | "public";
  userName: string;
  email: string;
  userId: string;
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

export class CustomError extends Error {
  message: string;
  status: number;
  constructor(msg: string, status: number) {
    super(msg);
    this.message = msg;
    this.status = status;
  }
}
