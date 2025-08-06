import express from "express";
import dotenv from "dotenv"
import { startSendOTPConsumer } from "./consumer.js";

dotenv.config()

startSendOTPConsumer()

const app = express();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});


app.get("/", (req, res) => {
  res.send("Hello cuties!");
});
