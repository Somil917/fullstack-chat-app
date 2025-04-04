import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { Socket, io } from "socket.io-client";

export type User = {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
  createdAt?: string;
};

interface UseUserStoreProps {
  isCheckingAuth: boolean;
  isLoggingout: boolean;
  isUpdatingProfile: boolean;
  authUser: User | null;
  socket: Socket | null;
  onlineUsers: string[];

  checkAuth: () => void;
  userSignup: (user: User) => void;
  userLogin: (user: User) => void;
  updateProfile: (data: Partial<User>) => void;
  userLogout: () => void;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:4000" : "/";

export const useUserStore = create<UseUserStoreProps>((set, get) => ({
  isCheckingAuth: true,
  isLoggingout: false,
  isUpdatingProfile: false,
  authUser: null,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get(`/users/profile`);

      if (res.status === 200) {
        const data = res.data;
        set({
          authUser: {
            _id: data._id,
            name: data.name,
            email: data.email,
            profilePic: data.profilePic,
            createdAt: data.createdAt,
          },
        });

        get().connectSocket();
      }
    } catch (err) {
      console.log(err);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  userSignup: (user) => {
    set({ authUser: user });
    get().connectSocket();
  },
  userLogin: (user) => {
    set({ authUser: user });
    get().connectSocket();
  },
  updateProfile: async (data) => {
    try {
      set({ isUpdatingProfile: true });

      const res = await axiosInstance.put("/users/update-profile", data);

      const resData = res.data;

      set({ authUser: resData });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in updating profile", error);
      toast.error("Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  userLogout: async () => {
    try {
      set({ isLoggingout: true });
      const res = await axiosInstance.get(`/users/logout`);

      set({ authUser: null });
      const data = res.data;

      get().disconnectSocket();

      return data.message;
    } catch (err) {
      console.log(err);
    } finally {
      set({ isLoggingout: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });

    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },
}));
