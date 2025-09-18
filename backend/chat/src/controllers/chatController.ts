import axios from "axios";
import asyncHandler from "../utils/asyncHandler.js";
import type { AuthenticatedRequest } from "../middlewares/isAuth.js";
import { Chat } from "../models/ChatModel.js";
import { Messages } from "../models/MessagesModel.js";
import { ApiError } from "../utils/ApiError.js";

// controller to create a new chat between two users

export const createNewChat = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    // get user id from req.user that is set in isAuth middleware means current logged in user

    const userId = req.user?._id;

    // get other user id from req.body
    const { otherUserId } = req.body;

    // if other user id is missing return error
    if (!otherUserId) {
      throw new ApiError(400, "Other userid is required");
    }

    // check if there is already a chat between these two users

    const existingChat = await Chat.findOne({
      users: { $all: [userId, otherUserId], $size: 2 },
    });

    // if chat already exists return the chat id

    if (existingChat) {
      res.json({
        message: "Chat already exists",
        chatId: existingChat._id,
      });
      return;
    }

    // if no chat exists create a new chat with logged in user and other user

    const newChat = await Chat.create({
      users: [userId, otherUserId],
    });

    // return the new chat id
    res.status(201).json({
      message: "New Chat created",
      chatId: newChat._id,
    });
  }
);

// controller to get all chats of loggedIn user

export const getAllChats = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    // get user id from req.user that is set in isAuth middleware means current loggedIn user

    const userId = req.user?._id;

    // if user id is missing return error

    if (!userId) {
      throw new ApiError(401, "Unauthorized user");
    }

    // there can be multiple chats of a user so we will use find method to get all chats of loggedIn user with latest chats on top

    const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });

    // now we going to extract user data, in the topbar of chat we show the name and profile of other user so we will make a request to user service to get the user data of other user

    // make a request to user service to get the user data of other user

    const chatWithUserData = await Promise.all(
      // map through all chats
      chats.map(async (chat) => {
        // ab un chats mein do user ki hi id rhegi , ek loggedIn user ki id aur ek other user ki id , to hme other user ki id nikalni hai

        const otherUserId = chat.users.find((id) => id !== userId);

        // unseen message count nikal rhe hai , ki kitne number of messages hai jo loggedIn user ne nhi dekhe

        const unseenCount = await Messages.countDocuments({
          chatId: chat._id,
          sender: { $ne: userId },
          seen: false,
        });

        try {
          // make a request to user service to get the user data of other user using axios

          const { data } = await axios.get(
            `${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`
          );

          return {
            user: data, // other user data
            chat: {
              ...chat.toObject(), // chat converted to plain js object

              latestMessage: chat.latestMessage || null, // latest message in the chat
              unseenCount,
            },
          };
        } catch (error) {
          console.log(error);
          return {
            user: { _id: otherUserId, name: "Unknown User" },
            chat: {
              ...chat.toObject(),
              latestMessage: chat.latestMessage || null,
              unseenCount,
            },
          };
        }
      })
    );

    // return the chats with other user data
    res.json({
      chats: chatWithUserData,
    });
  }
);

// controller to send a message in a chat

export const sendMessage = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    // get sender id from req.user that is set in isAuth middleware means current loggedIn user ( kyuki current loggedIn user hi message bhej rha hai )

    const senderId = req.user?._id;

    const { chatId, text } = req.body;

    // now we need to handle image upload so we will use multer middleware to handle image upload and the uploaded image will be available in req.file

    const imageFile = req.file;

    // check if sender id / current loggedIn user id and chat id is present or not

    if (!senderId) {
      res.status(401).json({
        message: "unauthorized",
      });
      return;
    }

    if (!chatId) {
      res.status(400).json({
        message: "Chatid Required",
      });
      return;
    }

    // check if either text or image is present

    if (!text && !imageFile) {
      res.status(400).json({
        message: "Either text or image is required",
      });
      return;
    }

    // extract the chat from db using chat id where both users , current user and other user are present

    const chat = await Chat.findById(chatId);

    // if no chat found return error

    if (!chat) {
      res.status(404).json({
        message: "Chat not found",
      });
      return;
    }

    // we have to restrict that only users who are part of this chat can send message in this chat , so we will check if the sender id is present in the users array of chat

    const isUserInChat = chat.users.some(
      (userId) => userId.toString() === senderId.toString()
    );

    // if sender id is not present in the users array of chat return error

    if (!isUserInChat) {
      res.status(403).json({
        message: "You are not participant of this chat",
      });
      return;
    }

    // get the id of other user to whom the message is being sent

    const otherUserId = chat.users.find(
      (userId) => userId.toString() !== senderId.toString()
    );

    // if no other user found return error

    if (!otherUserId) {
      res.status(401).json({
        message: "No other user",
      });
      return;
    }

    // Need to setup socket

    let messageData: any = {
      chatId: chatId,
      sender: senderId,
      seen: false,
      seenAt: undefined,
    };

    // if image is present then set the image url which we recieved from cloudinary and public id in the message data

    // otherwise set the text in the message data

    if (imageFile) {
      messageData.image = {
        url: imageFile.path,
        publicId: imageFile.filename,
      };
      messageData.messageType = "image";
      messageData.text = text || "";
    } else {
      messageData.messageType = "text";
      messageData.text = text;
    }

    // create a new message with the message data

    const message = new Messages(messageData);

    // save the message to db
    const savedMessage = await message.save();

    // update the latest message in the chat and update the updatedAt field of chat to current date and time

    const latestMessageText = imageFile ? "📷 Image" : text;

    await Chat.findByIdAndUpdate(
      chatId,
      {
        latestMessage: {
          text: latestMessageText,
          sender: senderId,
        },
        updatedAt: new Date(),
      },
      { new: true }
    );

    // emit to sockets

    res.status(201).json({
      message: savedMessage,
      sender: senderId,
    });
  }
);

// controller to get all messages of a chat

export const getMessagesByChat = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    // get user id from req.user that is set in isAuth middleware means current loggedIn user

    const userId = req.user?._id;

    // get chat id from req.params
    const { chatId } = req.params;

    // if user id is missing return error
    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    // if chat id is missing return error
    if (!chatId) {
      res.status(400).json({
        message: "ChatId Required",
      });
      return;
    }

    // extract the chat from db using chat id where both users , current user and other user are present

    const chat = await Chat.findById(chatId);

    // if no chat found return error

    if (!chat) {
      res.status(404).json({
        message: "Chat not found",
      });
      return;
    }

    // we have to restrict that only users ( current user and other user ) who are part of this chat can view messages in this chat

    // so we will check if the user id is present in the users array of chat

    const isUserInChat = chat.users.some(
      (userId) => userId.toString() === userId.toString()
    );

    // if user id is not present in the users array of chat return error

    if (!isUserInChat) {
      res.status(403).json({
        message: "You are not participant of this chat",
      });
      return;
    }

    // messages fetch krne se pehle saare unseen messages ko seen mark krna hai jinka sender current user nhi hai

    const messagesToMarkseen = await Messages.find({
      chatId: chatId,
      sender: { $ne: userId },
      seen: false,
    });

    // ab in sabhi messages ko seen mark krdo

    await Messages.updateMany(
      {
        chatId: chatId,
        sender: { $ne: userId },
        seen: false,
      },
      {
        seen: true,
        seenAt: new Date(),
      }
    );

    // now fetch all messages of this chat from db sorted by createdAt in ascending order

    // ascending order means oldest message first and latest message last dikhega

    const messages = await Messages.find({ chatId }).sort({ createdAt: 1 });

    // get the id of other user to whom the message is being sent

    const otherUserId = chat.users.find((id) => id !== userId);

    // make a request to user service to get the user data of other user using axios

    try {
      const { data } = await axios.get(
        `${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`
      );

      // if no other user found return error
      if (!otherUserId) {
        res.status(400).json({
          message: "No other user",
        });
        return;
      }

      // socket work here 
      
      // jaise maan lo user is already in same chat mein hai as ki wo online hai , to usko socket se mark as seen ---> krdenge message ko

      res.json({
        messages,
        user: data,
      });
    } catch (error) {
      console.log(error);
      res.json({
        messages,
        user: { _id: otherUserId, name: "Unknown User" },
      });
    }
  }
);
