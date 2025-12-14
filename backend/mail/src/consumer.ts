import amqp from "amqplib";

import { sendMail } from "./utils/sendMail.js"

// Load environment variables from .env file


// Function to start the RabbitMQ consumer for sending OTP emails
export const startSendOTPConsumer = async () => {
  try {
    if (!process.env.RABBITMQ_URL) {
      throw new Error("RABBITMQ_URL missing");
    }

    // connect to RabbitMQ server using amqplib library

    const connection = await amqp.connect(process.env.RABBITMQ_URL!);

    // create a channel of about RabbitMQ connection
    const channel = await connection.createChannel();

    // claim a queue for sending otp emails
    const queueName = "send-otp";

    // assert that the queue exists
    await channel.assertQueue(queueName, {
      durable: true,
    });

    console.log("Mail Service consumer started, listening for otp emails");

    // consume messages from the queue
    channel.consume(queueName, async (msg) => {
      if (!msg) return;

      try {
        const { to, subject, body } = JSON.parse(msg.content.toString());

        console.log("📩 Sending OTP mail via Resend to:", to);

        await sendMail(to, subject, body);

      

        console.log("✅ OTP mail sent:");
        channel.ack(msg);
      } catch (err) {
        console.error("❌ Failed to send OTP", err);
        channel.nack(msg, false, true);
      }
    });
  } catch (error) {
    console.log("Failed to start rabbitmq consumer", error);
  }
};
