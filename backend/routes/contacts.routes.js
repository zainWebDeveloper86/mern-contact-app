import express from "express";
import multer from "multer";
import path from "path";
import {
  getAllContacts,
  getSingleContact,
  addContactUser,
  updateContactUser,
  deleteContactUser,
  deleteAllContacts,
  searchContact,
} from "../controllers/contacts.controller.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const newFileName = Date.now() + path.extname(file.originalname);
    cb(null, newFileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only Images are Allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3, // 3MB
  },
  fileFilter: fileFilter,
});

router.get("/", getAllContacts);
router.get("/search", searchContact);
router.get("/:id", getSingleContact);
router.post("/", upload.single("user_img"), addContactUser);
router.put("/:id", upload.single("user_img"), updateContactUser);
router.delete("/:id", deleteContactUser);
router.delete("/", deleteAllContacts);

export default router;
