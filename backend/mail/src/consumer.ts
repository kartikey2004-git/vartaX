import amqp from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Function to start the RabbitMQ consumer for sending OTP emails
export const startSendOTPConsumer = async () => {
  try {

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

        console.log("📩 Sending OTP mail to:", to);

        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const info = await transporter.sendMail({
          from: `"vartaX" <${process.env.SMTP_USER}>`,
          to,
          subject,
          text: body,
        });

        console.log("✅ OTP mail sent:", info.messageId);
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
