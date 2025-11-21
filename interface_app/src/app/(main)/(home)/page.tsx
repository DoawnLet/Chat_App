"use client";

import React, { useState } from "react";
import CreatePost from "@/components/CreatePost";
import PostList from "@/components/PostList";
import { Post } from "@/services/user_info/post.types";

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const handlePostCreated = (newPost: Post) => {
    // Add new post to the top of the list
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Trang chủ</h1>
          <p className="text-muted-foreground">
            Xem những bài đăng mới nhất từ cộng đồng
          </p>
        </div>

        {/* Create Post */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Posts Feed */}
        <PostList initialPosts={posts} />
      </div>
    </div>
  );
};

export default HomePage;
