import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const connectDB = async () => {
  
  // extract mongoURI from environment variables
  const url = process.env.MONGO_URI;

  // check uri is present or not
  if (!url) {
    throw new ApiError(
      400,
      "Mongo_URI is not defined in environment variables"
    );
  }

  // try to connect to mongoDB database using mongoose
  try {
    const connectionInstance = await mongoose.connect(url, {
      dbName: "vartaX",
    });

    console.log(
      `\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB ", error);
    process.exit(1);
  }
};

export default connectDB;