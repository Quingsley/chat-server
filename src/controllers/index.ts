import { NextFunction, Request, Response } from "express";
import { User } from "../types";
import { createUserHandler, getUserContactsHandler, getUserHandler } from "../handlers";

export async function signUp(req: Request, res: Response, next: NextFunction) {
  const { userName, email, userId } = req.body;
  const user: User = {
    userName: userName,
    email: email,
    userId: userId,
    contacts: [],
    chats: [],
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
