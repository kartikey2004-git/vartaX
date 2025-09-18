import mongoose, { Document, Schema, Types } from "mongoose";

// Define the IMessage interface which extends mongoose document 

export interface IMessage extends Document {
  chatId: Types.ObjectId; 
  sender: string; 
  text?: string;
  image?: {
    url: string;
    publicId: string;
  };
  messageType: "text" | "image";
  seen: boolean;
  seenAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    // Reference to Chat model
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    // User ID of the sender user
    sender: {
      type: String,
      required: true,
    },

    // message content either ya toh text hoga ya image

    text: String, 
    image: {
      url: String, // image URL jo cloudinary se milega
      publicId: String, // cloudinary ka public id
    },
    // message type , which is enum either text or image
    messageType: {
      type: String,
      enum: ["text", "image"],
      default: "text",
    },
    // check if the message is seen by the recipient intially default false hoga
    seen: {
      type: Boolean,
      default: false,
    },
    // timestamp when the message was seen
    seenAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);


export const Messages = mongoose.model<IMessage>("Messages",messageSchema)