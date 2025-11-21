"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Post } from "@/services/user_info/post.types";
import { postService } from "@/services/user_info/post.service";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  onPostUpdate?: (updatedPost: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdate }) => {
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Vừa xong";
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;

    return date.toLocaleDateString("vi-VN");
  };

  const getAvatarUrl = (avatarUrl?: string, displayName?: string) => {
    if (avatarUrl && avatarUrl.startsWith("http")) {
      return avatarUrl;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName || "User"
    )}&background=6366f1&color=fff&size=128&bold=true&format=png`;
  };

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    try {
      const result = await postService.toggleLike(post.id);
      const updatedPost = {
        ...post,
        isLiked: result.isLiked,
        likesCount: result.likesCount,
      };
      onPostUpdate?.(updatedPost);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = async () => {
    if (isBookmarking) return;

    setIsBookmarking(true);
    try {
      const result = await postService.toggleBookmark(post.id);
      const updatedPost = {
        ...post,
        isBookmarked: result.isBookmarked,
      };
      onPostUpdate?.(updatedPost);
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <article className="bg-card border border-border rounded-xl p-6 mb-6 shadow-sm hover:shadow-lg transition-all duration-200 hover:border-border/60">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Image
            src={getAvatarUrl(post.author.avatarUrl, post.author.displayName)}
            alt={`${post.author.displayName} avatar`}
            width={44}
            height={44}
            className="w-11 h-11 rounded-full object-cover border-2 border-border ring-2 ring-background"
            unoptimized
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-base truncate">
              {post.author.displayName}
            </h3>
            <p className="text-sm text-muted-foreground">
              @{post.author.handle} • {formatDate(post.createdAt)}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
          aria-label="Post options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-foreground whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Post Image */}
      {post.imageUrl && (
        <div className="mb-4 rounded-xl overflow-hidden border border-border">
          <Image
            src={post.imageUrl}
            alt="Post image"
            width={600}
            height={400}
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        </div>
      )}

      {/* Post Stats */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4" />
          <span>{post.likesCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          <span>{post.commentsCount}</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={isLiking}
          className={cn(
            "flex items-center gap-2 px-3 py-2 h-auto transition-colors",
            post.isLiked
              ? "text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          {isLiking ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Heart className={cn("w-4 h-4", post.isLiked && "fill-current")} />
          )}
          <span className="text-sm font-medium">
            {isLiking ? "Đang xử lý..." : "Thích"}
          </span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-3 py-2 h-auto text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Bình luận</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-3 py-2 h-auto text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm font-medium">Chia sẻ</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          disabled={isBookmarking}
          className={cn(
            "flex items-center gap-2 px-3 py-2 h-auto transition-colors",
            post.isBookmarked
              ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          {isBookmarking ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Bookmark
              className={cn("w-4 h-4", post.isBookmarked && "fill-current")}
            />
          )}
          <span className="text-sm font-medium">
            {isBookmarking ? "Đang lưu..." : "Lưu"}
          </span>
        </Button>
      </div>
    </article>
  );
};

export default PostCard;
