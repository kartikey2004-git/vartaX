import mongoose from "mongoose";

const connectDB = async () => {
  const url = process.env.MONGO_URI;

  if (!url) {
    throw new Error("Mongo_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(url, {
      dbName: "vartaX",
    });

    console.log("Connect to mongoDb");
  } catch (error) {
    console.error("Failed to connect to MongoDB ", error);
    process.exit(1);
  }
};

export default connectDB