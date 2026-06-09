import mongoose from "mongoose";

export const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to Database!");
  } catch (error) {
    console.log("Connected Failed to Database: ", error.message);
  }
};
