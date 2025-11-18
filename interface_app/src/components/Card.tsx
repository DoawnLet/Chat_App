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
        <div className="grid gap-3 mb-4">
          {/* Search Results Header */}
          <div className="text-sm text-muted-foreground mb-2">
            Tìm thấy {totalCount} kết quả cho {safeKeyword}
          </div>

          {/* User Cards */}
          {data.map((item: searchItem) => (
            <article
              key={item.id || item.handle}
              className="flex items-center gap-3 p-3 bg-card border border-border rounded-md hover:shadow-md transition-shadow"
            >
              <Image
                src={getAvatarUrl(
                  item.avatarUrl,
                  item.displayName,
                  item.handle
                )}
                alt={item.displayName || "User Avatar"}
                width={48}
                height={48}
                className="w-16 h-16 rounded-full object-cover border-2 border-border"
                unoptimized
              />

              <div className="flex-1">
                <div className="font-semibold text-lg text-foreground">
                  {item.displayName || "Unknown User"}
                </div>
                <div className="text-sm text-muted-foreground">
                  @{item.handle || "no-handle"}
                </div>
              </div>

              <button
                onClick={() => handleAddFriend(item)}
                className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-primary-foreground rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                Add Friend
              </button>
            </article>
          ))}

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground">
                Trang {pageNumber} / {totalPages} ({data.length} kết quả)
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-accent transition-colors"
                  disabled={pageNumber <= 1 || loading}
                  onClick={handlePreviousPage}
                >
                  Trước
                </button>

                <div className="text-sm text-muted-foreground px-2">
                  {pageNumber}
                </div>

                <button
                  className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-accent transition-colors"
                  disabled={pageNumber >= totalPages || loading}
                  onClick={handleNextPage}
                >
                  Sau
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
