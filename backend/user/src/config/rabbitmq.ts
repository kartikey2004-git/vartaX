import amqp from "amqplib"; 

// amqp : this package helps to manage connections between our application and RabbitMQ server

let channel: amqp.Channel; // channel : a medium through which messages are sent and received from the RabbitMQ server


// Function to connect to RabbitMQ server
export const connectRabbitMQ = async () => {
  try {

    // Establish connection to RabbitMQ using amqplib package 
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.RABBITMQ_HOST,
      port: 5672,
      username: process.env.RABBITMQ_USERNAME,
      password: process.env.RABBITMQ_PASSWORD,
    });

    // Create a channel for communication with RabbitMQ server
    channel = await connection.createChannel();

    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.log("Failed to connect to rabbitmq", error);
  }
};


// Function to publish messages to a specific queue in RabbitMQ
export const publishToQueue = async (queueName: string, message: any) => {

  // Ensure the channel is initialized before publishing
  if (!channel) {
    console.log("Rabbitmq channel is not intialized");
    return;
  }

  // Assert the queue (create if it doesn't exist) with durable option to ensure messages are not lost
  await channel.assertQueue(queueName, { durable: true });

  
  // Send the message to the specified queue, converting it to a Buffer and marking it as persistent
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
};
