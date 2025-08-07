import mongoose, { Schema , Document } from "mongoose";

export interface IChat extends Document {
  users: String[];
  latestMessage: {
    text: string;
    sender: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const chatSchema: Schema<IChat> = new Schema(
  {
    users: [
      {
        type: String,
        required: true,
      },
    ],
    latestMessage: {
      text: String,
      sender: String,
    },
  },
  { timestamps: true }
);

export const Chat = mongoose.model<IChat>("Chat",chatSchema)