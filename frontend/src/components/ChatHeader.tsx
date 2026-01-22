import React from "react";
import { Button } from "./ui/button";
import { Menu, UserCircle } from "lucide-react";
import { User } from "@/context/AppContext";

interface ChatHeaderProps {
  user: User | null;
  setSidebarOpen: (open: boolean) => void;
  isTyping: boolean;
  onlineUsers: string[];
}

const ChatHeader = ({
  user,
  setSidebarOpen,
  isTyping,
  onlineUsers,
}: ChatHeaderProps) => {
  const isOnlineUser = user && onlineUsers.includes(user._id);

  return (
    <>
      <div className="sm:hidden fixed top-3 right-3 z-30">
        <Button
          className="p-2 rounded-sm bg-secondary/50 backdrop-blur-md border border-border/50 shadow-sm hover:bg-secondary transition-all mr-6 mt-8"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-4 h-4 text-foreground" />
        </Button>
      </div>

      <div className="mb-4 bg-card backdrop-blur-xl rounded-lg border border-border/50 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center shadow-inner border border-border/50">
                  <UserCircle className="w-6 h-6 text-muted-foreground" />
                </div>

                {isOnlineUser && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background">
                    <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-foreground truncate">{user?.name}</h2>

                <div className="flex items-center gap-2">
                  {isTyping ? (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                        <div
                          className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>

                      <span className="text-primary font-medium">
                        typing...
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          isOnlineUser
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {isOnlineUser ? "Online" : "Offline"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center border border-border/50 shadow-inner">
                <UserCircle className="w-6 h-6 text-muted-foreground" />
              </div>

              <div>
                <h2 className="text-base font-medium text-muted-foreground">
                  Select a conversation
                </h2>
                <p className="text-xs text-muted-foreground/70 mt-0.5">
                  Choose a chat from the sidebar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatHeader;
