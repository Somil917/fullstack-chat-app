import { create } from "zustand";
import { User } from "./useUserStore";
import axiosInstance from "@/lib/axios";
import { useUserStore } from "@/stores/useUserStore";

type Message = {
  _id: string;
  text?: string;
  senderId: string;
  recieverId: string;
  createdAt: string;
  image?: string | null;
};

interface useChatStoreProps {
  isGettingUsers: boolean;
  isMessagesLoading: boolean;
  selectedUser: User | null;
  users: User[] | null;
  messages: Message[] | null;
  getUsers: () => void;
  getMessages: (userId: string) => void;
  sendMessage: (messageData: { text: string, image: string | null; }) => void;
  subscribeToMessages: () => void;
  unsubscribeToMessages: () => void;
  setSelectedUser: (selectedUser: User | null) => void;
}

export const useChatStore = create<useChatStoreProps>((set, get) => ({
  isGettingUsers: false,
  isMessagesLoading: false,
  selectedUser: null,
  messages: null,
  users: [],

  getUsers: async () => {
    set({ isGettingUsers: true });
    try {
      const res = await axiosInstance.get("/messages/getUsers");
      const data = res.data;
      set({ users: data });
    } catch (error) {
      console.log("Error Fetching usersForSidebar", error);
    } finally {
      set({ isGettingUsers: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      const data = res.data;
      set({ messages: data });
    } catch (error) {
      console.log("Error getting messages: ", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    try {
      const { selectedUser, messages } = get();
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser?._id}`,
        messageData
      );
      const data = res.data;
      set({ messages: [...(messages ?? []), data] });
    } catch (error) {
      console.log("Error sending message: ", error);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useUserStore.getState().socket;

    socket?.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      set({ messages: [...(get().messages as []), newMessage] });
    });
  },

  unsubscribeToMessages: () => {
    const socket = useUserStore.getState().socket;
    socket?.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
