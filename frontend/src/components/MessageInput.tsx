/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Loader2, Paperclip, Send, X } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface MessageInputProps {
  selectedUser: string | null;
  message: string;
  setMessage: (message: string) => void;
  handleMessageSend: (e: any, imageFile?: File | null) => void;
}

const MessageInput = ({
  selectedUser,
  message,
  setMessage,
  handleMessageSend,
}: MessageInputProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!message.trim() && !imageFile) return;

    setIsUploading(true);
    await handleMessageSend(e, imageFile);
    setImageFile(null);
    setIsUploading(false);
  };

  if (!selectedUser) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border-t border-gray-700 pt-2"
    >
      {imageFile && (
        <div className="relative w-fit">
          <Image
            src={URL.createObjectURL(imageFile)}
            alt="preview"
            className="w-24 h-24 object-cover rounded-lg border border-gray-600"
            width={200}
            height={200}
          />
          <Button
            type="button"
            className="absolute -top-2 -right-2 bg-black rounded-full p-1"
            onClick={() => setImageFile(null)}
          >
            <X className="w-4 h-4 text-white" />
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Label className="cursor-pointer bg-[#0d1117] hover:bg-gray-800 rounded-sm px-3 py-3 transition-colors">
          <Paperclip size={18} className="text-gray-300" />
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file && file.type.startsWith("image/")) {
                setImageFile(file);
              }
            }}
          />
        </Label>
        <Input
          type="text"
          className="border border-[#30363d] bg-[#0d1117] px-4 py-5 text-white placeholder-gray-500 outline-none transition-colors focus:ring-1 focus:ring-[#1f6feb] focus:ring-offset-[#0f1117] flex-1 rounded-lg"
          placeholder={imageFile ? "Add a caption..." : "Type a message"}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <Button
          type="submit"
          disabled={(!imageFile && !message) || isUploading}
          className="bg-[#0d1117] hover:bg-gray-800 px-4 py-3 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed text-white"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;
