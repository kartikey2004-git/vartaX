import React from "react";
import { Button } from "./ui/button";
import { Menu, UserCircle } from "lucide-react";
import { User } from "@/context/AppContext";
import ThemeToggle from "@/components/ThemeToggle";

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
      <div className="sm:hidden fixed top-3 right-3 z-30 flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-md"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-4 h-4 text-foreground" />
        </Button>
      </div>

      <div className="mb-3 rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-secondary/40">
                  <UserCircle className="w-6 h-6 text-muted-foreground" />
                </div>

                {isOnlineUser && (
                  <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-green-500" />
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
                    <div className="flex items-center gap-2 text-sm">
                      <span
                        className={`font-medium ${
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
            <div className="flex w-full items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-secondary/40">
                  <UserCircle className="w-6 h-6 text-muted-foreground" />
                </div>

                <div>
                  <h2 className="text-base font-medium text-muted-foreground">
                    Select a conversation
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground/80">
                    Choose a chat from the sidebar
                  </p>
                </div>
              </div>
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
            </div>
          )}
          {user && (
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatHeader;
