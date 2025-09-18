import mongoose, { Schema , Document } from "mongoose";

export interface IChat extends Document {

  users: String[]; // Array of user IDs involved in the chat 

  latestMessage: {
    text: string;
    sender: string;
  }; // latest message which we are going to show on the sidebar of userchat list

  createdAt: Date; // timestamp for when the chat was created

  updatedAt: Date; // timestamp for when the chat was last updated
}

const chatSchema: Schema<IChat> = new Schema(
  { 
    // array of user IDs involved in the chat
    users: [
      {
        type: String,
        required: true,
      },
    ],

    // latest message which we are going to show on the sidebar of userchat list
    latestMessage: {
      text: String,
      sender: String,
    },
  },
  { timestamps: true }
);

export const Chat = mongoose.model<IChat>("Chat",chatSchema)