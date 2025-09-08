import express from "express";
import dotenv from "dotenv"
import { startSendOTPConsumer } from "./consumer.js";

dotenv.config()

// start the consumer to listen for messages
startSendOTPConsumer()

// create express app
const app = express();

// app listening on particular port
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// Test route
app.get("/", (req, res) => {
  res.send("Hello cuties!");
});
