import { useChatStore } from "@/stores/useChatStore";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect, useState } from "react";

const UsersContainer = () => {
  const { getUsers, isGettingUsers, users, setSelectedUser, selectedUser } =
    useChatStore();

  const { onlineUsers } = useUserStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState<boolean>(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isGettingUsers) return <div>Loading...</div>;

  const filteredUsers = showOnlineOnly
    ? users?.filter((user) => onlineUsers.includes(user._id))
    : users;

  return (
    <div>
      <div className="hidden sm:flex items-center p-3 py-2 gap-x-1">
        <input
          type="checkbox"
          checked={showOnlineOnly}
          onChange={(e) => setShowOnlineOnly(e.target.checked)}
        />
        <div>({onlineUsers.length - 1} online)</div>
      </div>
      {filteredUsers?.map((user, i) => (
        <div
          onClick={() => {
            setSelectedUser(user);
          }}
          className={`w-full py-2.5 ${
            selectedUser && selectedUser?._id === user._id
              ? "bg-neutral-200/50"
              : "bg-transparent"
          } hover:bg-neutral-200/50 transition px-2 flex justify-center sm:justify-start items-center gap-x-2 cursor-pointer`}
          key={user._id || i}
        >
          <div className="relative">
            <div className="rounded-full border border-zinc-400 size-11 cursor-pointer overflow-hidden">
              <img
                className="h-full w-full object-cover"
                src={user.profilePic || "../public/avatar.png"}
                alt="userProfile"
              />
            </div>
            {onlineUsers.includes(user._id) && (
              <div className="absolute -bottom-0.5 bg-green-500 size-4 -right-0.5 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div className="hidden sm:block">
            <h2 className="text-base font-semibold">{user.name}</h2>
            <p className="text-sm text-neutral-600">
              {onlineUsers.includes(user._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      ))}
      {filteredUsers?.length === 0 && (
        <div className="py-2 px-3">No online users</div>
      )}
    </div>
  );
};

export default UsersContainer;
