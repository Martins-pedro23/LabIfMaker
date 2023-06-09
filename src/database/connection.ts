import { magenta, red } from "colorette";
import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

export const connetion = async (url?: string) => {
  try {
    if (!MONGODB_URL) throw new Error("MongoDB URL not found");
    const connect = await mongoose.connect(url ? url : MONGODB_URL);
    console.log(magenta(`💫 MongoDB connected`));
  } catch (error) {
    console.log(red("MongoDB connection failed"), error);
  }
};
