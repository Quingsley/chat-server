import { PATH, ROOM_PATH } from "../../constants";
import { CustomError, User } from "../../types";
import { readFile, writeToFile } from "../../utils";

/**
 *
 * @param user - The current user
 * @param contact - the new contact to be added
 */
export async function addContactHandler(userEmail: string, newContactEmail: string) {
  try {
    const users = await readFile<User[]>(PATH);

    const currentUser = users.find(u => u.email == userEmail);
    if (!currentUser) throw new CustomError("user not found", 404);
    const newContact = users.find(u => u.email === newContactEmail);
    if (!newContact) throw new CustomError("contact not found", 404);

    //check if the contact already exists on either users (& vice versa applies to)
    const isUserContactAvailable = currentUser.contacts.find(c => c.userId == newContact.userId);
    const isNewContactAvailable = newContact.contacts.find(c => c.userId == currentUser.userId);

    if (isUserContactAvailable?.userId && isNewContactAvailable?.userId)
      throw new CustomError("contact already exists", 422);

    //add new contact as part of user's contacts and vice versa
    currentUser.contacts.push({ userId: newContact.userId });
    newContact.contacts.push({ userId: currentUser.userId });

    //update the list of users
    const currentUserIndex = users.findIndex(u => u.email == currentUser.email);
    users[currentUserIndex] = currentUser;
    const newContactIndex = users.findIndex(u => u.email == newContact.email);
    users[newContactIndex] = newContact;

    await writeToFile(PATH, users);
  } catch (error) {
    throw error;
  }
}
