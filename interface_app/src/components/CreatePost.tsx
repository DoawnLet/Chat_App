"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { CreatePostRequest, Post } from "@/services/user_info/post.types";
import { postService } from "@/services/user_info/post.service";

interface CreatePostProps {
  onPostCreated?: (newPost: Post) => void;
  placeholder?: string;
}

const CreatePost: React.FC<CreatePostProps> = ({
  onPostCreated,
  placeholder = "Bạn đang nghĩ gì?",
}) => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && !imageUrl.trim()) return;

    setIsSubmitting(true);
    try {
      const postData: CreatePostRequest = {
        content: content.trim(),
        imageUrl: imageUrl.trim() || undefined,
      };

      const newPost = await postService.createPost(postData);

      // Reset form
      setContent("");
      setImageUrl("");
      setShowForm(false);

      // Notify parent
      onPostCreated?.(newPost);
    } catch (error) {
      console.error("Failed to create post:", error);
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent("");
    setImageUrl("");
    setShowForm(false);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {!showForm ? (
        // Compact view
        <div
          className="flex items-center gap-3 cursor-pointer hover:bg-accent/50 rounded-lg p-2 transition-colors"
          onClick={() => setShowForm(true)}
        >
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-muted-foreground">{placeholder}</p>
          </div>
        </div>
      ) : (
        // Expanded form
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleTextareaChange}
                placeholder="Chia sẻ điều bạn đang nghĩ..."
                className="w-full resize-none border-none bg-transparent text-foreground placeholder-muted-foreground focus:outline-none min-h-[80px]"
                rows={3}
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground mt-1">
                {content.length}/500
              </div>
            </div>
          </div>

          {/* Image URL input */}
          <div className="mb-3">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="URL hình ảnh (tùy chọn)"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Image preview */}
          {imageUrl && (
            <div className="mb-3 relative">
              <Image
                src={imageUrl}
                alt="Post preview"
                width={400}
                height={200}
                className="w-full max-h-48 object-cover rounded-lg border border-border"
                unoptimized
              />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                aria-label="Remove image"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                aria-label="Add image"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                aria-label="Add emoji"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (!content.trim() && !imageUrl.trim())}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
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
                    Đang đăng...
                  </span>
                ) : (
                  "Đăng"
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreatePost;
