import Users from "../models/users.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const createAccount = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await Users.findOne({
      $or: [{ username }, { email }],
    });
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required!", status: false });
    }
    if (existingUser)
      return res
        .status(400)
        .json({ message: "Username or Email already existed!", status: false });


    const saltCount = 10;
    const hashedpwd = await bcrypt.hash(password, saltCount);
    const user = new Users({ username, email, password: hashedpwd });
    const newUser = await user.save();

    return res.status(201).json({
      message: "Account Registered Successfully!",
      status: true,
      id: newUser?._id,
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};
export const loginAccount = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userChecked = await Users.findOne({ email });
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required!", status: false });
    }
    if (!userChecked)
      return res
        .status(404)
        .json({ message: "User not Found!", status: false });

    const isMatch = await bcrypt.compare(password, userChecked?.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Password not Matched!", status: false });

    const token = jwt.sign(
      { userId: userChecked?._id, username: userChecked?.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return res.status(200).json({
      message: "Logged in Successfully!",
      status: true,
      tokenID: token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

export const logoutAccount = async (req, res) => {
  return res
    .status(200)
    .json({ message: "Logged out Successfully!", status: true });
};
