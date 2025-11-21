import axiosConnected from "@/lib/axios";
import { PostListResponse, CreatePostRequest, Post } from "./post.types";

export const postService = {
  /**
   * Get posts feed with pagination
   */
  async getPosts(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PostListResponse> {
    const response = await axiosConnected.get("/api/Post/get-posts", {
      params: { pageNumber, pageSize },
    });
    return response.data;
  },

  /**
   * Get posts by user ID
   */
  async getUserPosts(
    userId: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PostListResponse> {
    const response = await axiosConnected.get(`/api/Post/user/${userId}`, {
      params: { pageNumber, pageSize },
    });
    return response.data;
  },

  /**
   * Create new post
   */
  async createPost(data: CreatePostRequest): Promise<Post> {
    const response = await axiosConnected.post("/api/Post/create", data);
    return response.data;
  },

  /**
   * Like/unlike post
   */
  async toggleLike(
    postId: string
  ): Promise<{ isLiked: boolean; likesCount: number }> {
    const response = await axiosConnected.post(`/api/Post/${postId}/like`);
    return response.data;
  },

  /**
   * Bookmark/unbookmark post
   */
  async toggleBookmark(postId: string): Promise<{ isBookmarked: boolean }> {
    const response = await axiosConnected.post(`/api/Post/${postId}/bookmark`);
    return response.data;
  },

  /**
   * Delete post
   */
  async deletePost(postId: string): Promise<void> {
    await axiosConnected.delete(`/api/Post/${postId}`);
  },
};
