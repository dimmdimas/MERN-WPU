import mongoose from "mongoose";
import { DATABASE_URL } from "./env";

const connectDB = async () => {
  try {
    if (!DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined");
    }
    await mongoose.connect(DATABASE_URL);
    return Promise.resolve("Database connected successfully");
  } catch (error) {
    const err = error as unknown as Error;
    return Promise.resolve(err.message);
  }
}

export default connectDB;