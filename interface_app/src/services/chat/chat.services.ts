import axiosConnected from "@/lib/axios";

export const chatService = {
  async conversationDirect(data: ConversationDirect) {
    const response = await axiosConnected.post("/api/Conversation/direct", {
      params: {},
    });
  },
};
