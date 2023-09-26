import { PATH } from "../constants";
import { Contacts, Ack, User, Status } from "../types";
import { getUsers } from "../utils";

export async function getUserContacts(id: string, callback: Ack<User[]>) {
  const users = await getUsers<User[]>(PATH);
  const user = users.find(user => user.id === id);
  let userContacts: User[] = [];
  if (user) {
    user.contacts.forEach(id => {
      const c = users.find(u => u.id === id.userId);
      if (c) {
        userContacts.push(c);
      }
    });

    callback({ status: Status.Success, message: "user contacts", data: userContacts });
  } else {
    callback({ status: Status.Failure, message: "user contacts not found", data: [] });
  }
}
