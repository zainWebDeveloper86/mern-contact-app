import express from "express";
import dotenv from "dotenv";
import userRouter from './routes/users.routes.js'
import authMiddleware from "./middleware/auth.middleware.js";
import { connectionDB } from "./config/database.js";
import contactRouter from "./routes/contacts.routes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

dotenv.config();
const PORT = process.env.PORT || 8000;

// Database
connectionDB();

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use(cors({
//   origin: "https://contact-app-zain.vercel.app",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }))

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: false  // ← yeh false karo jab origin * ho
}))

//Middleware for routes
app.use("/api/users",userRouter)

// authorization
app.use(authMiddleware)
app.use("/api/contacts", contactRouter);

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res
      .status(400)
      .send(`Image Error: ${error.message}, status code: ${error.code}`);
  } else if (error) {
    return res.status(500).send(`Something went wrong: ${error.message}`);
  }
  next();
});

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
