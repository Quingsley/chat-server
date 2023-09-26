import { PATH } from "../constants";
import { CustomError, User } from "../types";
import { getUsers } from "../utils";

export async function getUserContactsHandler(email: string) {
  const users = await getUsers<User[]>(PATH);
  const user = users.find(user => user.email === email);
  let userContacts: User[] = [];
  if (user) {
    user.contacts.forEach(id => {
      const c = users.find(u => u.userId === id.userId);
      if (c) {
        userContacts.push(c);
      }
    });
    return userContacts;
  } else throw new CustomError("User not found", 404);
}
