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
import { SocketData } from "@/context/SocketContext";

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

  const { onlineUsers, socket } = SocketData();
  // console.log(onlineUsers);

  // now we are going to create some useStates which we are going to send in sidebar that which user is selected in chats sidebar

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
    null,
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
        },
      );

      setMessages(data.messages);
      setUser(data.user);
      await fetchChats();
    } catch (error) {
      console.log(error);
      toast.error("Failed to load messages");
    }
  }

  const moveChatToTop = (
    chatId: string,
    newMessage: any,
    updatedUnseenCount = true,
  ) => {
    setChats((prev) => {
      if (!prev) return null;

      const updatedChats = [...prev];
      const chatIndex = updatedChats.findIndex(
        (chat) => chat.chat._id === chatId,
      );

      if (chatIndex !== -1) {
        const [moveChat] = updatedChats.splice(chatIndex, 1);

        const updatedChat = {
          ...moveChat,
          chat: {
            ...moveChat.chat,
            latestMessage: {
              text: newMessage.text,
              sender: newMessage.sender,
            },
            updatedAt: new Date().toString(),

            unseenCount:
              updatedUnseenCount && newMessage.sender !== loggedInUser?._id
                ? (moveChat.chat.unseenCount || 0) + 1
                : moveChat.chat.unseenCount || 0,
          },
        };
        updatedChats.unshift(updatedChat);
      }
      return updatedChats;
    });
  };

  const resetUnseenCount = (chatId: string) => {
    setChats((prev) => {
      if (!prev) return null;

      return prev.map((chat) => {
        if (chat.chat._id === chatId) {
          return {
            ...chat,
            chat: {
              ...chat.chat,
              unseenCount: 0,
            },
          };
        }
        return chat;
      });
    });
  };

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
        },
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
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }

    socket?.emit("stopTyping", {
      chatId: selectedUser,
      userId: loggedInUser?._id,
    });

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
        },
      );

      setMessages((prev) => {
        const currentMessages = prev || [];
        const messageExists = currentMessages.some(
          (msg) => msg._id === data.message._id,
        );

        if (!messageExists) {
          return [...currentMessages, data.message];
        }
        return currentMessages;
      });

      setMessage("");

      const displayText = imageFile ? "image" : message;

      moveChatToTop(
        selectedUser!,
        {
          text: displayText,
          sender: data.sender,
        },
        false,
      );
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

    if (!selectedUser || !socket) return;

    // socket setup
    if (value.trim()) {
      socket.emit("typing", {
        chatId: selectedUser,
        userId: loggedInUser?._id,
      });
    }

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      socket.emit("stopTyping", {
        chatId: selectedUser,
        userId: loggedInUser?._id,
      });
    }, 2000);

    setTypingTimeout(timeout);
  };

  useEffect(() => {
    socket?.on("newMessage", (message) => {
      console.log("Recieved new message:", message);

      if (selectedUser === message.chatId) {
        setMessages((prev) => {
          const currentMessages = prev || [];
          const messageExists = currentMessages.some(
            (msg) => msg._id === message._id,
          );

          if (!messageExists) {
            return [...currentMessages, message];
          }
          return currentMessages;
        });

        moveChatToTop(message.chatId, message, false);
      } else {
        moveChatToTop(message.chatId, message, true);
      }
    });

    socket?.on("messagesSeen", (data) => {
      console.log("Message seen by:", data);

      if (selectedUser === data.chatId) {
        setMessages((prev) => {
          if (!prev) return null;
          return prev.map((msg) => {
            if (
              msg.sender === loggedInUser?._id &&
              data.messageIds &&
              data.messageIds.includes(msg._id)
            ) {
              return {
                ...msg,
                seen: true,
                seenAt: new Date().toString(),
              };
            } else if (msg.sender === loggedInUser?._id && !data.messageIds) {
              return {
                ...msg,
                seen: true,
                seenAt: new Date().toString(),
              };
            }
            return msg;
          });
        });
      }
    });

    socket?.on("userTyping", (data) => {
      console.log("recieved user typing", data);
      if (data.chatId === selectedUser && data.userId !== loggedInUser?._id) {
        setIsTyping(true);
      }
    });

    socket?.on("userStoppedTyping", (data) => {
      console.log("recieved user stopped typing", data);
      if (data.chatId === selectedUser && data.userId !== loggedInUser?._id) {
        setIsTyping(false);
      }
    });

    return () => {
      socket?.off("newMessage");
      socket?.off("messagesSeen");
      socket?.off("userTyping");
      socket?.off("userStoppedTyping");
    };
  }, [socket, selectedUser, setChats, loggedInUser?._id]);

  useEffect(() => {
    if (selectedUser) {
      fetchChat();
      setIsTyping(false);

      resetUnseenCount(selectedUser);

      socket?.emit("joinChat", selectedUser);

      return () => {
        socket?.emit("leaveChat", selectedUser);
        setMessages(null);
      };
    }
  }, [selectedUser, socket]);

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
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
        createChat={createChat}
        onlineUsers={onlineUsers}
      />

      <div className="flex-1 flex flex-col justify-between p-6 backdrop-blur-xl bg-card/80 border border-border/50 rounded-lg mx-4 my-4">
        <ChatHeader
          onlineUsers={onlineUsers}
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
