/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { User } from "@/context/AppContext";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { LogOut, Plus, Search, UserCircle, X } from "lucide-react";
import { Input } from "./ui/input";
import Link from "next/link";

interface ChatSideBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  showAllUsers: boolean;
  setShowAllUsers: (show: boolean | ((prev: boolean) => boolean)) => void;
  users: User[] | null;
  loggedInUser: User | null;
  chats: any[] | null;
  selectedUser: string | null;
  setSelectedUser: (userId: string | null) => void;
  handleLogout: () => void;
  createChat: (user: User) => void;
  onlineUsers: string[];
}

const ChatSideBar = ({
  sidebarOpen,
  setSidebarOpen,
  showAllUsers,
  setShowAllUsers,
  users,
  loggedInUser,
  chats,
  selectedUser,
  setSelectedUser,
  handleLogout,
  createChat,
  onlineUsers,
}: ChatSideBarProps) => {
  const [searchQuery, setsearchQuery] = useState("");
  return (
    <aside
      className={`fixed z-20 sm:static top-0 left-0 h-screen w-80 bg-[#161b22] border-r-2 border-[#202c33]/60 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 transition-transform duration-300 flex flex-col`}
    >
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#202c33]/60">
        <h1 className="text-lg font-semibold text-gray-100 tracking-wide">
          Chats
        </h1>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowAllUsers((prev) => !prev)}
            className="p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-md hover:bg-white/20 transition-all"
          >
            {showAllUsers ? (
              <X className="w-5 h-5 text-gray-300" />
            ) : (
              <Plus className="w-5 h-5 text-gray-300" />
            )}
          </Button>

          <Button
            onClick={() => setSidebarOpen(false)}
            className="sm:hidden p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-md hover:bg-white/20 transition-all"
          >
            <X className="w-5 h-5 text-gray-300" />
          </Button>
        </div>
      </div>

      <div className="p-3 border-b border-[#202c33]/60">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setsearchQuery(e.target.value)}
            placeholder="Search or start new chat"
            className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-4 py-6 text-white placeholder-gray-500 outline-none transition-colors focus:ring-1 focus:ring-[#1f6feb] focus:ring-offset-[#0f1117] pl-10 pr-4"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#202c33] scrollbar-track-transparent">
        {showAllUsers ? (
          <div className="space-y-0">
            {users
              ?.filter(
                (user) =>
                  user._id !== loggedInUser?._id &&
                  user.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((u) => (
                <div
                  key={u._id}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#323c43] transition-colors group"
                  onClick={() => createChat(u)}
                >
                  {/* Avatar + Online dot */}
                  <div className="relative w-11 h-11 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                    <UserCircle className="w-6 h-6 text-gray-300" />
                    {onlineUsers.includes(u._id) && (
                      <span className="absolute top-6 right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-gray-900" />
                    )}
                  </div>

                  {/* Name + Status */}
                  <div className="flex-1 min-w-0">
                    <p className="font-normal text-gray-100 truncate">
                      {u.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {onlineUsers.includes(u._id) ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        ) : chats && chats.length > 0 ? (
          <div className="space-y-0">
            {chats.map((chat) => {
              const latestMessage = chat.chat.latestMessage;
              const isSelected = selectedUser === chat.chat._id;
              const unseenCount = chat.chat.unseenCount || 0;

              return (
                <div
                  key={chat.chat._id}
                  onClick={() => {
                    setSelectedUser(chat.chat._id);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-200 ${
                    isSelected ? "bg-gray-800" : "hover:bg-[#323c43]"
                  }`}
                >
                  {/* Avatar + Online dot */}
                  <div className="relative w-11 h-11 rounded-full flex items-center justify-center">
                    <UserCircle className="w-6 h-6 text-gray-300" />
                    {onlineUsers.includes(chat.user._id) && (
                      <span className="absolute top-6 right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-gray-900" />
                    )}
                  </div>

                  {/* Chat details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-normal text-gray-100 truncate">
                        {chat.user.name}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {latestMessage?.text || "No messages yet"}
                    </p>
                  </div>

                  {/* Unseen count */}
                  {unseenCount > 0 && (
                    <div className="ml-2 bg-green-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                      {unseenCount > 99 ? "99+" : unseenCount}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 px-4">
            <p className="text-lg font-medium">No chats yet</p>
            <p className="mt-1 text-sm">Start a new chat to begin messaging</p>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-[#161b22]/90 border-t border-gray-700 p-4 space-y-2">
        <Link
          href="/profile"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <div className="p-1.5 rounded-lg">
            <UserCircle className="w-4 h-4 text-gray-300" />
          </div>
          <span className="font-medium text-gray-300">Profile</span>
        </Link>

        <Button
          onClick={handleLogout}
          className="w-full py-4 rounded-lg font-medium transition-colors bg-[#0f1117] hover:bg-[#1a1d25] text-white flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
};

export default ChatSideBar;
