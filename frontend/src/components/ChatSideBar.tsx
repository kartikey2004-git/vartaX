/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { User } from "@/context/AppContext";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Plus, Search, UserCircle, X } from "lucide-react";
import { Input } from "./ui/input";
import ProfileDialog from "./ProfileDialog";

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
  createChat,
  onlineUsers,
}: ChatSideBarProps) => {
  const [searchQuery, setsearchQuery] = useState("");
  return (
    <aside
      className={`fixed z-20 sm:static top-0 left-0 h-screen w-80 bg-card border-r border-border/60 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 transition-transform duration-300 flex flex-col rounded-r-xl shadow-sm`}
    >
      <div className="h-16 px-6 flex items-center justify-between border-b border-border/60">
        <h1 className="text-lg font-semibold text-foreground tracking-wide">
          Chats
        </h1>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowAllUsers((prev) => !prev)}
            className="p-2 rounded-md bg-secondary/50 backdrop-blur-md border border-border/50 shadow-sm hover:bg-secondary transition-all"
          >
            {showAllUsers ? (
              <X className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Plus className="w-5 h-5 text-muted-foreground" />
            )}
          </Button>

          <Button
            onClick={() => setSidebarOpen(false)}
            className="sm:hidden p-2 rounded-md bg-secondary/50 backdrop-blur-md border border-border/50 shadow-sm hover:bg-secondary transition-all"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <div className="p-4 border-b border-border/60">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setsearchQuery(e.target.value)}
            placeholder="Search or start new chat"
            className="pl-10 pr-4"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {showAllUsers ? (
          <div className="space-y-0">
            {users
              ?.filter(
                (user) =>
                  user._id !== loggedInUser?._id &&
                  user.name.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              .map((u) => (
                <div
                  key={u._id}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent/50 transition-colors group rounded-md mx-2 my-1"
                  onClick={() => createChat(u)}
                >
                  <div className="relative w-11 h-11 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                    <UserCircle className="w-6 h-6 text-muted-foreground" />
                    {onlineUsers.includes(u._id) && (
                      <span className="absolute top-6 right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-background" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {u.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
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
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-200 rounded-md mx-2 my-1 ${
                    isSelected ? "bg-accent" : "hover:bg-accent/50"
                  }`}
                >
                  <div className="relative w-11 h-11 rounded-full flex items-center justify-center">
                    <UserCircle className="w-6 h-6 text-muted-foreground" />
                    {onlineUsers.includes(chat.user._id) && (
                      <span className="absolute top-6 right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-background" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-foreground truncate">
                        {chat.user.name}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {latestMessage?.text || "No messages yet"}
                    </p>
                  </div>

                  {unseenCount > 0 && (
                    <div className="ml-2 bg-primary text-primary-foreground text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                      {unseenCount > 99 ? "99+" : unseenCount}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground px-4">
            <p className="text-lg font-medium">No chats yet</p>
            <p className="mt-1 text-sm">Start a new chat to begin messaging</p>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-card/90 border-t border-border p-4">
        <ProfileDialog>
          <Button className="w-full py-3 rounded-md font-medium transition-colors bg-secondary hover:bg-secondary/80 text-foreground flex items-center justify-center gap-3">
            <div className="p-1.5 rounded-md">
              <UserCircle className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="font-medium">
              {loggedInUser?.name || "Profile"}
            </span>
          </Button>
        </ProfileDialog>
      </div>
    </aside>
  );
};

export default ChatSideBar;
