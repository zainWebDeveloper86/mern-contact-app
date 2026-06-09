import express from "express";
import {
  createAccount,
  loginAccount,
  logoutAccount,
} from "../controllers/users.controller.js";

const router = express.Router();

router.post("/register", createAccount);
router.post("/login", loginAccount);
router.post("/logout", logoutAccount);

export default router;
