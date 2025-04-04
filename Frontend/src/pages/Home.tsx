import ChatContainer from "@/components/ChatContainer";
import Modal from "@/components/Modal";
import NotSelectedUser from "@/components/NotSelectedUser";
import Sidebar from "@/components/Sidebar";
import { useChatStore } from "@/stores/useChatStore";
import { useUserStore } from "@/stores/useUserStore";
import { LogOut } from "lucide-react";
import { useState } from "react";

const Home = () => {
  const { authUser, isUpdatingProfile, updateProfile, userLogout } =
    useUserStore();
  const { selectedUser } = useChatStore();
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result as string;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="flex">
      <Modal>
        <div className="w-full relative flex flex-col items-center gap-y-2">
          <div
            onClick={userLogout}
            className="absolute text-red-700 cursor-pointer right-0 top-0"
          >
            <LogOut />
          </div>

          <h1 className="text-2xl font-semibold">Profile</h1>
          <p>Your profile information</p>
          <div className="w-full">
            <div>
              <div className="relative flex justify-center items-center">
                <label
                  htmlFor="avatar-upload"
                  className={`
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
                >
                  <div>
                    <img
                      src={selectedImg || authUser?.profilePic || "/avatar.png"}
                      alt="Profile"
                      className="size-32 rounded-full object-cover border-4 "
                    />
                  </div>
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  Full Name
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {authUser?.name}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  Email Address
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {authUser?.email}
                </p>
              </div>
            </div>

            <div className="mt-6 bg-base-300 rounded-xl">
              <h2 className="text-lg font-medium  mb-4">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                  <span>Member Since</span>
                  <span>{authUser?.createdAt?.split("T")[0]}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Account Status</span>
                  <span className="text-green-500">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Sidebar />
      {!selectedUser ? <NotSelectedUser /> : <ChatContainer />}
    </div>
  );
};

export default Home;
