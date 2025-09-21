/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { chat_service, useAppData, User } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import ChatSideBar from "@/components/ChatSideBar";
import { toast } from "sonner";
import Cookies from "js-cookie";
import axios from "axios";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";
import MessageInput from "@/components/MessageInput";

// Interface in which we are going to map the messages

export interface Message {
  _id: string; // unique id for particular message
  chatId: string; // chatId for particular chat between two users

  sender: string; // senderId for particular chat / id of current loggedIn user

  // message text
  text?: string;

  // image url from cloudinary and publicId
  image?: {
    url: string;
    publicId: string;
  };

  // type of particular message
  messageType: "text" | "image";

  seen: boolean; // message seen or not
  seenAt?: string; // at what message should be seen
  createdAt: string;
}

const ChatApp = () => {
  const {
    loading,
    isAuth,
    logoutUser,
    chats,
    user: loggedInUser,
    users,
    fetchChats,
    setChats,
  } = useAppData();

  // now we are going to create some useStates which we are going to send in sidebar

  // which user is selected in chats sidebar

  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // a state which we are going to send in input in which we will recieve the message

  const [message, setMessage] = useState("");

  // state for sidebar toggle where we display all the users

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // state for extracting all the messages of particular user

  const [messages, setMessages] = useState<Message[] | null>(null);

  // state to show name on person with whom we are chatting on top bar

  const [user, setUser] = useState<User | null>(null);

  // state for showing all users with whom jinke sath hum chat kr skte hai and uspe hi click krke hum new chat banayenge

  const [showAllUsers, setShowAllUsers] = useState(false);

  // state for checking is user typing or not

  const [isTyping, setIsTyping] = useState(false);

  // state for timeout for typing

  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const router = useRouter();

  // but if user is not authenticated , then we redirect to login page

  // but in appcontext , isAuth intially value is false and this will give value isAuth : false , then we'll  be redirect to login page even if user authenticated bhi hai tab bhi

  useEffect(() => {
    if (!isAuth && !loading) {
      router.push("/login");
    }
  }, [isAuth, router, loading]);

  const handleLogout = () => logoutUser();

  async function fetchChat() {
    const token = Cookies.get("token");

    try {
      const { data } = await axios.get(
        `${chat_service}/api/v1/message/${selectedUser}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(data.messages);
      setUser(data.user);
      await fetchChats();
    } catch (error) {
      console.log(error);
      toast.error("Failed to load messages");
    }
  }

  async function createChat(u: User) {
    try {
      const token = Cookies.get("token");

      const { data } = await axios.post(
        `${chat_service}/api/v1/chat/new`,
        {
          userId: loggedInUser?._id,
          otherUserId: u._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedUser(data.chatId);
      setShowAllUsers(false);

      await fetchChats();
    } catch (error) {
      toast.error("Failed to start chat");
    }
  }

  const handleMessageSend = async (e: any, imageFile?: File | null) => {
    e.preventDefault();

    if (!message.trim() && !imageFile) return;

    if (!selectedUser) return;

    // socket work

    const token = Cookies.get("token");

    try {
      const formData = new FormData();

      formData.append("chatId", selectedUser);

      if (message.trim()) {
        formData.append("text", message);
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const { data } = await axios.post(
        `${chat_service}/api/v1/message`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessages((prev) => {
        const currentMessages = prev || [];
        const messageExists = currentMessages.some(
          (msg) => msg._id === data.message._id
        );

        if (!messageExists) {
          return [...currentMessages, data.message];
        }
        return currentMessages;
      });

      setMessage("");

      const displayText = imageFile ? "image" : message;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to send message");
      }
    }
  };

  const handleTyping = (value: string) => {
    setMessage(value);

    if (!selectedUser) return;

    // socket setup
  };

  useEffect(() => {
    if (selectedUser) {
      fetchChat();
    }
  }, [selectedUser]);

  if (loading) return <Loading />;

  return (
    <div
      className="min-h-screen flex 
    bg-[#161b22] text-white overflow-hidden"
    >
      <ChatSideBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        showAllUsers={showAllUsers}
        setShowAllUsers={setShowAllUsers}
        users={users}
        loggedInUser={loggedInUser}
        chats={chats}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        handleLogout={handleLogout}
        createChat={createChat}
      />

      <div className="flex-1 flex flex-col justify-between p-4 backdrop-blur-xl bg-white/5 border-1 border-white/10">
        <ChatHeader
          user={user}
          setSidebarOpen={setSidebarOpen}
          isTyping={isTyping}
        />

        <ChatMessages
          selectedUser={selectedUser}
          messages={messages}
          loggedInuser={loggedInUser}
        />

        <MessageInput
          selectedUser={selectedUser}
          message={message}
          setMessage={handleTyping}
          handleMessageSend={handleMessageSend}
        />
      </div>
    </div>
  );
};

export default ChatApp;

// Chat page contains components like sidebar , message input and more things

// after fetching all chats of particular authenticated user , we need to fetch all users which we are going to show in sidebar
