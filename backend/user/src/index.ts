import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { createClient } from "redis";
import userRoutes from "./routes/routes.js"
import { connectRabbitMQ } from "./config/rabbitmq.js";
import cors from "cors"

dotenv.config(); // dotenv configuration to access env variables 

connectDB(); ; // Initialize and establish database connection

// connect to rabbitmq server
connectRabbitMQ()


// Get Redis URL from environment variables
const redisUrl = process.env.REDIS_URL;


// Ensure Redis URL is available in environment variables
if (!redisUrl) {
  throw new Error("REDIS_URL environment variable is not defined");
}

// Create a Redis client instance
export const redisClient = createClient({
  url: redisUrl,
});

// connection to redis server
redisClient
  .connect()
  .then(() => console.log("connected to redis"))
  .catch(console.error);


// create express app
const app = express();

// middleware for parsing json data and handling cors error
app.use(express.json())
app.use(cors())

// define userRoutes 
app.use("/api/v1",userRoutes)

// specific port 
const port = process.env.PORT || 5000;


// start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// basic route to check server is running or not 
app.get("/", (req, res) => {
  res.send("Hello world!");
});
