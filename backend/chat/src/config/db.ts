import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const connectDB = async () => {
  // get MongoDB connection string from environment variables
  const url = process.env.MONGO_URI;

  // if MongoDB connection string is not defined, throw an error
  if (!url) {
    throw new ApiError(
      400,
      "Mongo_URI is not defined in environment variables"
    );
  }

  // try to connect to MongoDB using mongoose
  try {
    const connection = await mongoose.connect(url, {
      dbName: "vartaX",
    });

    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("Failed to connect to MongoDB ", error);
    process.exit(1);
  }
};

export default connectDB;