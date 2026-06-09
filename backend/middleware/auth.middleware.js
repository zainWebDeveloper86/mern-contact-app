import jwt from "jsonwebtoken";
import Users from "../models/users.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;
    // console.log(bearerHeader);

    if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No Token Provided!", status: false });
    }

    const token = bearerHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Users.findById(decoded?.userId).select("-password"); //reterives all except password

    if (!user) {
      return res.status(403).json({ message: "Invalid User!", status: false });
    }

    req.user = user;
    req.token = decoded;
    next();
  } catch (error) {
    if (error.name == "TokenExpiredError")
      return res.status(401).json({ message: "Token Expired!", status: false });
    if (error.name == "jsonWebTokenError")
      return res.status(401).json({
        message: "Invalid token authentication failed!",
        status: false,
      });

    return res.status(500).json({ message: error.message, status: false });
  }
};

export default authMiddleware;
