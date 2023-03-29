import mongoose from "mongoose";
require("dotenv").config();

const connectDB = async (): Promise<void> => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URL as string, {});
    console.log("connected to database");
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
