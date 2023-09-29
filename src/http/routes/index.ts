import { Router } from "express";
import { signUp, userContacts, userSignIn, addContact } from "../controllers";

const router = Router();

router.get("/", (req, res) => {
  return res.status(200).json({ message: "Welcome to WeeChat" });
});

router.post("/sign-in", userSignIn);
router.post("/sign-up", signUp);
router.post("/contacts", userContacts);
router.post("/add-contact", addContact);

export { router };
