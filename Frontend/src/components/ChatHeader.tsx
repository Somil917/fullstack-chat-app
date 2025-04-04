import { useChatStore } from "@/stores/useChatStore";
import { useUserStore } from "@/stores/useUserStore";
import { X } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useUserStore();

  return (
    <header className="py-2 px-3 flex justify-between items-center bg-neutral-200/50 w-full">
      <div className="flex items-center gap-x-2.5">
        <div className="rounded-full size-11 cursor-pointer overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src={selectedUser?.profilePic || "../public/avatar.png"}
            alt="userProfile"
          />
        </div>
        <div>
          <h2 className="text-base font-semibold">{selectedUser?.name}</h2>
          <p className="text-sm text-neutral-600">
            {selectedUser && onlineUsers.includes(selectedUser?._id)
              ? "Online"
              : "Offline"}
          </p>
        </div>
      </div>
      <div
        onClick={() => {
          setSelectedUser(null);
        }}
        className="cursor-pointer"
      >
        <X size={30} />
      </div>
    </header>
  );
};

export default ChatHeader;
