import { useChatStore } from "@/stores/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import { useUserStore } from "@/stores/useUserStore";
import { formatMessageTime } from "@/lib/utils";

const ChatContainer = () => {
  const { authUser } = useUserStore();
  const {
    selectedUser,
    getMessages,
    isMessagesLoading,
    messages,
    subscribeToMessages,
    unsubscribeToMessages,
  } = useChatStore();
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser?._id);
      subscribeToMessages();
    }

    return () => {
      unsubscribeToMessages();
    };
  }, [getMessages, selectedUser, subscribeToMessages, unsubscribeToMessages]);

  useEffect(() => {
    if (endRef.current && messages) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading)
    return (
      <div className="flex flex-1 justify-center items-center">Loading...</div>
    );

  return (
    <div className="flex-1 h-screen flex flex-col ">
      <ChatHeader />
      <div className="px-3 py-2 mt-14 flex-1 overflow-y-auto">
        {messages?.map((message) => (
          <div
            key={message._id}
            className={`flex gap-x-2 mt-2 ${
              message.senderId === authUser?._id
                ? "justify-end"
                : "justify-start"
            }`}
            ref={endRef}
          >
            {message.recieverId === authUser?._id && (
              <div className="size-9 rounded-full overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={selectedUser?.profilePic || "/avatar.png"}
                  alt="profile pic"
                />
              </div>
            )}
            {message.text && message.image ? (
              <div
                className={`flex max-w-60 flex-col ${
                  message.senderId === authUser?._id
                    ? "bg-blue-500"
                    : "bg-neutral-600"
                } rounded-md`}
              >
                <div className=" p-2">
                  <div className="aspect-square overflow-hidden rounded-md">
                    <img
                      className="w-full h-full object-cover"
                      src={message.image}
                      alt="message img"
                    />
                  </div>
                </div>
                <div className=" text-white px-2 py-1">
                  <div className="flex justify-between w-full gap-x-4">
                    <span className="">{message.text}</span>
                    <time className="text-xs whitespace-nowrap mt-3 flex justify-end items-end opacity-80">
                      {formatMessageTime(message.createdAt)}
                    </time>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`flex flex-col ${
                  message.senderId === authUser?._id
                    ? "bg-blue-500"
                    : "bg-neutral-600"
                } rounded-md`}
              >
                {message.image && (
                  <div className="w-60 p-2">
                    <div className="aspect-square overflow-hidden rounded-md">
                      <img
                        className="w-full h-full object-cover"
                        src={message.image}
                        alt="message img"
                      />
                    </div>
                  </div>
                )}
                {message.text && (
                  <div className=" text-white px-2 py-1">
                    <div className="flex justify-between w-full gap-x-4">
                      {message.text}
                      <time className="text-xs mt-3 flex justify-end items-end opacity-80">
                        {formatMessageTime(message.createdAt)}
                      </time>
                    </div>
                  </div>
                )}
              </div>
            )}

            {message.senderId === authUser?._id && (
              <div className="size-9 rounded-full overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={authUser?.profilePic || "/avatar.png"}
                  alt="profile pic"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <ChatInput />
    </div>
  );
};

export default ChatContainer;
