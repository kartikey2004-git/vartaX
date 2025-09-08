import amqp from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Function to start the RabbitMQ consumer for sending OTP emails
export const startSendOTPConsumer = async () => {
  try {

    // connect to RabbitMQ server using amqplib library
    
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.RABBITMQ_HOST,
      port: 5672,
      username: process.env.RABBITMQ_USERNAME,
      password: process.env.RABBITMQ_PASSWORD,
    });

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
      if (msg) {
        try {

          // parse the message content
          const { to, subject, body } = JSON.parse(msg.content.toString());

          // create a nodemailer transporter using SMTP
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          // send the email using the transporter
          await transporter.sendMail({
            from: "vartaX",
            to,
            subject,
            text: body,
          });

          console.log(`OTP mail sent to ${to}`);

          // acknowledge the message as processed
          channel.ack(msg);
        } catch (error) {
          console.log("Failed to send OTP", error);
        }
      }
    });
  } catch (error) {
    console.log("Failed to start rabbitmq consumer", error);
  }
};
