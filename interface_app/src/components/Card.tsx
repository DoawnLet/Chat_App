"use client";

import React from "react";
import Image from "next/image";
import { searchItem } from "@/services/user_info/search.types";

// Props interface for Card component
interface CardProps {
  data: searchItem[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  searchKeyword: string;
  onPageChange: (page: number) => void;
}

// Helper function for avatar URL with strict typing
const getAvatarUrl = (
  avatarUrl: string | null | undefined,
  displayName: string | null | undefined,
  handle: string | null | undefined
): string => {
  // Validate and use avatarUrl if it's a valid HTTP URL
  if (
    avatarUrl &&
    typeof avatarUrl === "string" &&
    avatarUrl.trim() !== "" &&
    avatarUrl !== "null" &&
    avatarUrl !== "string" &&
    avatarUrl.startsWith("http")
  ) {
    return avatarUrl;
  }

  // Determine name for avatar generation
  const nameForAvatar =
    displayName && typeof displayName === "string" && displayName !== "string"
      ? displayName
      : handle && typeof handle === "string"
      ? handle
      : "User";

  // Generate UI Avatar URL
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    nameForAvatar
  )}&background=6366f1&color=fff&size=128&bold=true&format=png`;
};

const Card: React.FC<CardProps> = ({
  data,
  loading,
  error,
  totalCount,
  pageNumber,
  pageSize,
  searchKeyword,
  onPageChange,
}) => {
  // ✅ Safe keyword normalization
  const safeKeyword = searchKeyword ?? "";
  const hasSearchKeyword = safeKeyword.trim().length > 0;

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Event handlers
  const handlePreviousPage = (): void => {
    if (pageNumber > 1) {
      onPageChange(pageNumber - 1);
    }
  };

  const handleNextPage = (): void => {
    if (pageNumber < totalPages) {
      onPageChange(pageNumber + 1);
    }
  };

  const handleAddFriend = (item: searchItem): void => {
    console.log("Adding friend:", item);
    // TODO: Implement add friend functionality
  };

  return (
    <section className="py-1 px-1 sm:px-2 lg:px-2">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          <span className="ml-2 text-sm text-muted-foreground">
            Đang tìm kiếm...
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-sm text-destructive mb-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          {error}
        </div>
      )}

      {/* Results */}
      {data && data.length > 0 ? (
        <div className="space-y-2">
          {/* Search Results Header */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span>
              Tìm thấy {totalCount} kết quả cho &quot;{searchKeyword}&quot;
            </span>
            <span className="text-xs">
              Trang {pageNumber} / {Math.ceil(totalCount / pageSize)}
            </span>
          </div>

          {/* User Cards - Facebook Style */}
          {data.map((item: searchItem) => (
            <article
              key={item.id || item.handle}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-all duration-200 hover:border-blue-200 dark:hover:border-blue-800"
            >
              {/* Avatar */}
              <div className="relative">
                <Image
                  src={getAvatarUrl(
                    item.avatarUrl,
                    item.displayName,
                    item.handle
                  )}
                  alt={`${item.displayName || "User"} avatar`}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover border-2 border-border"
                  unoptimized
                />
                {/* Online status indicator (mock) */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">
                    {item.displayName || "Unknown User"}
                  </h3>
                  {/* Verified badge (mock) */}
                  <svg
                    className="w-4 h-4 text-blue-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <p className="text-sm text-muted-foreground mb-2">
                  @{item.handle || "no-handle"}
                </p>

                {/* Mutual friends info (mock) */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>12 bạn chung</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleAddFriend(item)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center gap-2"
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
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Kết bạn</span>
                </button>

                <button
                  onClick={() => console.log("View profile:", item)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                >
                  Xem trang cá nhân
                </button>
              </div>
            </article>
          ))}

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground">
                Hiển thị {data.length} trên tổng {totalCount} kết quả
              </div>

              <div className="flex items-center gap-1">
                <button
                  className="px-3 py-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  disabled={pageNumber <= 1 || loading}
                  onClick={handlePreviousPage}
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="hidden sm:inline">Trước</span>
                </button>

                <div className="flex items-center gap-1 px-3">
                  <span className="text-sm font-medium">{pageNumber}</span>
                  <span className="text-sm text-muted-foreground">/</span>
                  <span className="text-sm text-muted-foreground">
                    {totalPages}
                  </span>
                </div>

                <button
                  className="px-3 py-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  disabled={pageNumber >= totalPages || loading}
                  onClick={handleNextPage}
                >
                  <span className="hidden sm:inline">Sau</span>
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        !loading &&
        hasSearchKeyword && (
          <div className="text-center py-8">
            <div className="text-sm text-muted-foreground mb-2">
              Không tìm thấy kết quả cho {safeKeyword}
            </div>
            <p className="text-xs text-muted-foreground">
              Thử tìm kiếm với từ khóa khác
            </p>
          </div>
        )
      )}
    </section>
  );
};

export default Card;
