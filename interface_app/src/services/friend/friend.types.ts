export type ContactStatus = "Pending" | "Accepted" | "Blocked";

export interface UserProfile {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl?: string | null;
}

export interface FriendRequest {
  id: string;
  sender: UserProfile;
  target: UserProfile;
  status: ContactStatus;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FriendStatus {
  isFriend: boolean;
  hasSentRequest: boolean;
  hasReceivedRequest: boolean;
  requestId?: string;
}

export interface Friend {
  id: string;
  friend: UserProfile;
  friendsSince: string;
  note?: string | null;
}

export interface SendFriendRequestRequest {
  tagerHandle: string;
  note?: string;
}

export interface ApiResponse<T> {
  flag: boolean;
  message: string;
  data?: T;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
