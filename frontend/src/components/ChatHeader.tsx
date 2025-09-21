import React from "react";
import { Button } from "./ui/button";
import { Menu, UserCircle } from "lucide-react";
import { User } from "@/context/AppContext";

interface ChatHeaderProps {
  user: User | null;
  setSidebarOpen: (open: boolean) => void;
  isTyping: boolean;
}

const ChatHeader = ({ user, setSidebarOpen, isTyping }: ChatHeaderProps) => {
  return (
    <>
      {/* mobile menu toggle button jisse sidebar ko open krne wale hai*/}

      <div className="sm:hidden fixed top-3 right-3 z-30">
        <Button
          className="p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-md hover:bg-white/20 transition-all"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-4 h-4 text-white/80" />
        </Button>
      </div>

      <div className="mb-4 bg-[#161b22] backdrop-blur-xl rounded-xl border border-white/10 p-4 shadow-md">
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center shadow-inner border border-white/20">
                  <UserCircle className="w-6 h-6 text-white/80" />
                </div>
                {/* online status dot */}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-white truncate">
                  {user?.name}
                </h2>
              </div>
              {/* to show typing status */}
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                <UserCircle className="w-6 h-6 text-white/60" />
              </div>

              <div>
                <h2 className="text-base font-medium text-white/70">
                  Select a conversation
                </h2>
                <p className="text-xs text-white/50 mt-0.5">
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
