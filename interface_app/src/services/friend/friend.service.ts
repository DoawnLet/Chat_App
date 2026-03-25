import axiosConnected, { getErrorMessage } from "@/lib/axios";
import {
  FriendRequest,
  Friend,
  SendFriendRequestRequest,
  ApiResponse,
  ContactStatus,
  PagedResult,
} from "./friend.types";

export const friendService = {
  // Gửi lời mời kết bạn
  async sendFriendRequest(
    data: SendFriendRequestRequest
  ): Promise<ApiResponse<FriendRequest>> {
    try {
      const response = await axiosConnected.post("/api/Contact/requests", data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Chấp nhận lời mời kết bạn
  async acceptFriendRequest(requestId: string): Promise<ApiResponse<FriendRequest>> {
    try {
      const response = await axiosConnected.patch("/api/Contact/requests/respond", {
        requestId,
        accept: true,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Từ chối lời mời kết bạn
  async declineFriendRequest(requestId: string): Promise<ApiResponse<FriendRequest>> {
    try {
      const response = await axiosConnected.patch("/api/Contact/requests/respond", {
        requestId,
        accept: false,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Hủy lời mời kết bạn đã gửi
  async cancelFriendRequest(requestId: string): Promise<ApiResponse<unknown>> {
    try {
      const response = await axiosConnected.delete(
        `/api/Contact/requests/${requestId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Lấy trạng thái kết bạn với một người dùng
  async getRelationshipStatus(targetHandle: string): Promise<ApiResponse<ContactStatus>> {
    try {
      const response = await axiosConnected.get(
        `/api/Contact/relationship/${encodeURIComponent(targetHandle)}`
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Lấy danh sách lời mời kết bạn đã nhận
  async getReceivedFriendRequests(
    page: number = 1,
    pageSize: number = 20
  ): Promise<PagedResult<FriendRequest>> {
    try {
      const response = await axiosConnected.get("/api/Contact/request/pending", {
        params: { page, pageSize },
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Lấy danh sách lời mời kết bạn đã gửi
  async getSentFriendRequests(
    page: number = 1,
    pageSize: number = 20
  ): Promise<PagedResult<FriendRequest>> {
    try {
      const response = await axiosConnected.get("/api/Contact/requests/sent", {
        params: { page, pageSize },
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Lấy danh sách bạn bè
  async getFriends(page: number = 1, pageSize: number = 20): Promise<PagedResult<Friend>> {
    try {
      const response = await axiosConnected.get("/api/Contact", {
        params: { page, pageSize },
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
