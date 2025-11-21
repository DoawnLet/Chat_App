export interface User {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl?: string;
}

export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
  author: User;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

export interface PostListResponse {
  data: {
    items: Post[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  flag: boolean;
  message: string;
}

export interface CreatePostRequest {
  content: string;
  imageUrl?: string;
}

export interface PostStats {
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
}
