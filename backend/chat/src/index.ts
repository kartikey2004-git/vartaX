import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import chatRoutes from "./routes/chat.js";
import cors from "cors"
import { app , server } from "./config/socket.js";

// configure dotenv to load environment variables throughout app
dotenv.config();


// connect to database
connectDB();


// middleware which parses incoming requests with JSON payloads
app.use(express.json())

// middleware to handle CORS issues
app.use(cors())

// define chat routes
app.use("/api/v1", chatRoutes);

// port from environment variables
const port = process.env.PORT;


// server listening on specified port
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
