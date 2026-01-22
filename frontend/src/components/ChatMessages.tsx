import { Message } from "@/app/chat/page";
import { User } from "@/context/AppContext";
import Image from "next/image";
import React, { useEffect, useMemo, useRef } from "react";
import moment from "moment";
import { Check, CheckCheck } from "lucide-react";

interface ChatMessagesProps {
  selectedUser: string | null;
  messages: Message[] | null;
  loggedInuser: User | null;
}

const ChatMessages = ({
  selectedUser,
  messages,
  loggedInuser,
}: ChatMessagesProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // seen feature

  const uniqueMessages = useMemo(() => {
    if (!messages) return [];
    const seen = new Set();
    return messages.filter((message) => {
      if (seen.has(message._id)) {
        return false;
      }
      seen.add(message._id);
      return true;
    });
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedUser, uniqueMessages]);

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full max-h-[calc(100vh-215px)] overflow-y-auto px-4 py-3 space-y-3 scrollbar-hide">
        {!selectedUser ? (
          <p className="text-muted-foreground text-center mt-20 text-sm">
            Please select a user to start chatting
          </p>
        ) : (
          <>
            {uniqueMessages.map((e, i) => {
              const isSentByMe = e.sender === loggedInuser?._id;

              const uniqueKey = `${e._id}-${i}`;

              return (
                <div
                  key={uniqueKey}
                  className={`flex flex-col gap-1 ${
                    isSentByMe ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`relative rounded-2xl px-4 py-2 max-w-xs sm:max-w-sm ${
                      e.messageType === "image"
                        ? ""
                        : `shadow-sm backdrop-blur-md ${
                            isSentByMe
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-card text-card-foreground rounded-bl-sm border border-border/50"
                          }`
                    }`}
                  >
                    {e.messageType === "image" && e.image && (
                      <div className="relative group w-52 h-52">
                        {" "}
                        <Image
                          src={e.image.url}
                          alt="shared image"
                          className="w-full h-full object-cover rounded-lg shadow-md"
                          width={200}
                          height={200}
                          unoptimized
                        />
                      </div>
                    )}
                    {e.text && <p className="whitespace-pre-line">{e.text}</p>}
                  </div>

                  <div
                    className={`flex items-center gap-1 text-[11px] text-muted-foreground ${
                      isSentByMe ? "pr-2 flex-row-reverse" : "pl-2"
                    }`}
                  >
                    <span>{moment(e.createdAt).format("hh:mm A · MMM D")}</span>

                    {isSentByMe && (
                      <div className="flex items-center ml-1">
                        {e.seen ? (
                          <div className="flex items-center gap-1 text-primary">
                            <CheckCheck className="w-3 h-3" />
                            {e.seenAt && (
                              <span>{moment(e.seenAt).format("hh:mm A")}</span>
                            )}
                          </div>
                        ) : (
                          <Check className="w-3 h-3 text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessages;
