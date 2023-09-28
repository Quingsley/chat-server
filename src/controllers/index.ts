import { NextFunction, Request, Response } from "express";
import { User } from "../types";
import { createUserHandler, getUserContactsHandler, getUserHandler, addContactHandler } from "../handlers";

export async function signUp(req: Request, res: Response, next: NextFunction) {
  const { userName, email, userId } = req.body;
  const user: User = {
    userName: userName,
    email: email,
    userId: userId,
    contacts: [],
    chats: [],
    type: "private",
  };

  try {
    const isSuccess = await createUserHandler(user);
    if (isSuccess) {
      res.status(201).json({
        status: "success",
        message: "user created",
        data: user,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function userSignIn(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;
  try {
    const user = await getUserHandler(email);
    if (user) {
      res.status(200).json({
        message: "sign in successful",
        data: user,
      });
    } else {
      res.status(404).json({
        message: "user not found",
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function userContacts(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;
  try {
    const contacts = await getUserContactsHandler(email);
    res.status(200).json({
      contacts: contacts,
    });
  } catch (error) {
    next(error);
  }
}

export async function addContact(req: Request, res: Response, next: NextFunction) {
  try {
    const { userEmail, newContactEmail } = req.body;
    if (userEmail === newContactEmail)
      return res.status(422).json({ message: "New contact cannot be the same as your email" });
    await addContactHandler(userEmail, newContactEmail);
    return res.status(201).json({ message: "contact added successfully" });
  } catch (error) {
    next(error);
  }
}
