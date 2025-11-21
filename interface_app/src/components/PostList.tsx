"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Post } from "@/services/user_info/post.types";
import { postService } from "@/services/user_info/post.service";
import PostCard from "./PostCard";

interface PostListProps {
  userId?: string; // Optional: show posts from specific user
  initialPosts?: Post[]; // Optional: pre-loaded posts
}

const PostList: React.FC<PostListProps> = ({ userId, initialPosts = [] }) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(!initialPosts.length);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const pageSize = 10;

  const fetchPosts = useCallback(
    async (page: number, append: boolean = false) => {
      try {
        setError(null);
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const response = userId
          ? await postService.getUserPosts(userId, page, pageSize)
          : await postService.getPosts(page, pageSize);

        const newPosts = response.data.items;

        if (append) {
          setPosts((prev) => [...prev, ...newPosts]);
        } else {
          setPosts(newPosts);
        }

        setHasNextPage(response.data.hasNextPage);
        setPageNumber(page);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Không thể tải bài đăng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    if (!initialPosts.length) {
      fetchPosts(1, false);
    }
  }, [fetchPosts, initialPosts.length]);

  const handleLoadMore = () => {
    if (hasNextPage && !loadingMore) {
      fetchPosts(pageNumber + 1, true);
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-lg p-4 animate-pulse"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
            <div className="space-y-2 mb-3">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
            <div className="h-32 bg-gray-300 rounded mb-3"></div>
            <div className="flex justify-between">
              <div className="h-8 bg-gray-300 rounded w-16"></div>
              <div className="h-8 bg-gray-300 rounded w-16"></div>
              <div className="h-8 bg-gray-300 rounded w-16"></div>
              <div className="h-8 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h3 className="text-lg font-medium mb-2">Không thể tải bài đăng</h3>
          <p>{error}</p>
        </div>
        <button
          onClick={() => fetchPosts(1, false)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="text-lg font-medium mb-2">
            {userId ? "Chưa có bài đăng nào" : "Chưa có bài đăng nào"}
          </h3>
          <p>
            {userId
              ? "Người dùng này chưa đăng bài viết nào."
              : "Hãy là người đầu tiên chia sẻ điều gì đó!"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Posts */}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onPostUpdate={handlePostUpdate} />
      ))}

      {/* Load More Button */}
      {hasNextPage && (
        <div className="text-center py-4">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang tải...
              </span>
            ) : (
              "Xem thêm bài đăng"
            )}
          </button>
        </div>
      )}

      {/* End of Feed */}
      {!hasNextPage && posts.length > 0 && (
        <div className="text-center py-8">
          <div className="text-muted-foreground">
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-sm">Bạn đã xem hết tất cả bài đăng!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;
