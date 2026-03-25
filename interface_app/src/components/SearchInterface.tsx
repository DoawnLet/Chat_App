"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { searchService } from "@/services/user_info/search.service";
import { searchItem } from "@/services/user_info/search.types";
import { friendService } from "@/services/friend/friend.service";
import { AxiosError } from "axios";
import {
  Search,
  X,
  Clock,
  Loader2,
  CheckCircle,
  Users,
  Hash,
  UserPlus,
  UserCheck,
  UserMinus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface FriendStatus {
  isFriend: boolean;
  hasSentRequest: boolean;
  hasReceivedRequest: boolean;
  requestId?: string;
  loading: boolean;
}

interface SearchState {
  data: searchItem[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

interface SearchInterfaceProps {
  initialQuery?: string;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({
  initialQuery = "",
}) => {
  const router = useRouter();
  const [keywords, setKeywords] = useState<string>(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const debouncedKeyword = useDebounce(keywords, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const [searchState, setSearchState] = useState<SearchState>({
    data: [],
    loading: false,
    error: null,
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
  });

  const [friendStatuses, setFriendStatuses] = useState<
    Record<string, FriendStatus>
  >({});

  const abortRef = useRef<AbortController | null>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent searches:", e);
      }
    }
  }, []);

  // Set initial query on mount
  useEffect(() => {
    if (initialQuery && !initialQuerySetRef.current) {
      setKeywords(initialQuery);
      initialQuerySetRef.current = true;
    }
  }, [initialQuery]);

  const initialQuerySetRef = useRef(false);

  // Reset page when search term changes
  useEffect(() => {
    setSearchState((prev) => ({ ...prev, pageNumber: 1 }));
  }, [debouncedKeyword]);

  // Fetch data when search term or page changes
  useEffect(() => {
    if (!debouncedKeyword.trim()) {
      setSearchState({
        data: [],
        loading: false,
        error: null,
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
      });
      return;
    }

    // Abort previous request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchData = async (): Promise<void> => {
      setSearchState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await searchService.search({
          keyword: debouncedKeyword,
          pageNumber: searchState.pageNumber,
          pageSize: searchState.pageSize,
        });

        const responseData = response?.data;

        if (!responseData) {
          throw new Error("Invalid response structure");
        }

        const items = Array.isArray(responseData.items)
          ? responseData.items
          : [];

        const totalCount =
          typeof responseData.totalCount === "number"
            ? responseData.totalCount
            : 0;

        setSearchState((prev) => ({
          ...prev,
          data: items,
          totalCount: totalCount,
          loading: false,
        }));
      } catch (error: unknown) {
        // Handle abort errors
        if (error instanceof Error) {
          if (error.name === "CanceledError" || error.name === "AbortError") {
            return;
          }
        }

        // Extract error message
        let errorMessage = "Đã có lỗi xảy ra khi tìm kiếm";

        if (error instanceof AxiosError) {
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.response?.status) {
            switch (error.response.status) {
              case 400:
                errorMessage = "Yêu cầu không hợp lệ";
                break;
              case 401:
                errorMessage = "Bạn cần đăng nhập để tiếp tục";
                break;
              case 403:
                errorMessage = "Bạn không có quyền truy cập";
                break;
              case 404:
                errorMessage = "Không tìm thấy dữ liệu";
                break;
              case 500:
                errorMessage = "Lỗi server, vui lòng thử lại sau";
                break;
              default:
                errorMessage = `Lỗi ${error.response.status}`;
            }
          }
        }

        setSearchState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [debouncedKeyword, searchState.pageNumber, searchState.pageSize]);

  // Event handlers
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (keywords.trim()) {
      // Add to recent searches
      const trimmedKeyword = keywords.trim();
      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s !== trimmedKeyword);
        const updated = [trimmedKeyword, ...filtered].slice(0, 5);
        localStorage.setItem("recentSearches", JSON.stringify(updated));
        return updated;
      });

      router.push(`/search?q=${encodeURIComponent(trimmedKeyword)}`);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setKeywords(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = (): void => {
    if (keywords.trim() || recentSearches.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (suggestion: string): void => {
    setKeywords(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleClearRecentSearch = (searchToRemove: string): void => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s !== searchToRemove);
      localStorage.setItem("recentSearches", JSON.stringify(filtered));
      return filtered;
    });
  };

  const handleClearAllRecent = (): void => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handlePageChange = (newPage: number): void => {
    setSearchState((prev) => ({ ...prev, pageNumber: newPage }));
  };

  const handleClearSearch = (): void => {
    setKeywords("");
    setSearchState({
      data: [],
      loading: false,
      error: null,
      totalCount: 0,
      pageNumber: 1,
      pageSize: 10,
    });
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Friend action handlers
  const handleSendFriendRequest = async (userId: string): Promise<void> => {
    setFriendStatuses((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], loading: true },
    }));

    try {
      const user = searchState.data.find((u) => u.id === userId);
      if (!user?.handle) throw new Error("Missing user handle");

      const res = await friendService.sendFriendRequest({ tagerHandle: user.handle });
      setFriendStatuses((prev) => ({
        ...prev,
        [userId]: {
          ...prev[userId],
          hasSentRequest: true,
          requestId: res.data?.id,
          loading: false,
        },
      }));
    } catch (error) {
      setFriendStatuses((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], loading: false },
      }));
      console.error("Failed to send friend request:", error);
    }
  };

  const handleCancelFriendRequest = async (
    userId: string,
    requestId: string
  ): Promise<void> => {
    setFriendStatuses((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], loading: true },
    }));

    try {
      await friendService.cancelFriendRequest(requestId);
      setFriendStatuses((prev) => ({
        ...prev,
        [userId]: {
          ...prev[userId],
          hasSentRequest: false,
          requestId: undefined,
          loading: false,
        },
      }));
    } catch (error) {
      setFriendStatuses((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], loading: false },
      }));
      console.error("Failed to cancel friend request:", error);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load friend status for search results
  useEffect(() => {
    if (searchState.data.length > 0) {
      const loadFriendStatuses = async () => {
        const statuses: Record<string, FriendStatus> = {};

        for (const user of searchState.data) {
          try {
            const rel = await friendService.getRelationshipStatus(user.handle);
            const s = rel.flag ? rel.data : undefined;

            statuses[user.id] = {
              isFriend: s === "Accepted",
              // backend relationship endpoint không phân biệt chiều sent/received.
              hasSentRequest: s === "Pending",
              hasReceivedRequest: false,
              loading: false,
            };
          } catch {
            // Default to not friends if error
            statuses[user.id] = {
              isFriend: false,
              hasSentRequest: false,
              hasReceivedRequest: false,
              loading: false,
            };
          }
        }

        setFriendStatuses(statuses);
      };

      loadFriendStatuses();
    }
  }, [searchState.data]);

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card className="shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search
                  className={cn(
                    "w-4 h-4 sm:w-5 sm:h-5 transition-colors",
                    keywords ? "text-primary" : "text-muted-foreground"
                  )}
                />
              </div>

              <Input
                ref={inputRef}
                type="search"
                value={keywords}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                placeholder="Tìm kiếm người dùng theo tên hoặc handle..."
                className="pl-9 sm:pl-10 pr-20 sm:pr-24 h-10 sm:h-12 text-sm sm:text-base"
                autoComplete="off"
              />

              {/* Clear Button */}
              {keywords && !searchState.loading && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="absolute right-16 sm:right-20 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 p-0"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              )}

              {/* Search Button */}
              <Button
                type="submit"
                disabled={!keywords.trim() || searchState.loading}
                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 h-8 sm:h-8 px-2 sm:px-3"
                size="sm"
              >
                {searchState.loading ? (
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <span className="hidden sm:inline">Tìm kiếm</span>
                )}
                <Search className="w-3 h-3 sm:w-4 sm:h-4 sm:hidden" />
              </Button>
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
              <div className="relative">
                <Card className="absolute top-0 left-0 right-0 shadow-lg z-50 max-h-80 overflow-y-auto border-t-0 rounded-t-none">
                  <CardContent className="p-0">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && !keywords.trim() && (
                      <div className="p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Tìm kiếm gần đây
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearAllRecent}
                            className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                          >
                            Xóa tất cả
                          </Button>
                        </div>
                        <div className="space-y-1">
                          {recentSearches.map((search, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer group"
                              onClick={() => handleSuggestionClick(search)}
                            >
                              <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{search}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClearRecentSearch(search);
                                }}
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                aria-label={`Xóa tìm kiếm: ${search}`}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Search Tips */}
                    {keywords.trim() && (
                      <>
                        <Separator />
                        <div className="p-3 sm:p-4">
                          <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Hash className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>
                              Mẹo: Nhập tên hoặc handle để tìm kiếm chính xác
                              hơn
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Search Stats */}
      {debouncedKeyword &&
        !searchState.loading &&
        searchState.data.length > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="font-medium text-primary">
                    {searchState.totalCount.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">
                    kết quả tìm thấy
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>Trang {searchState.pageNumber}</span>
                  <span>•</span>
                  <span>{searchState.data.length} hiển thị</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Error State */}
      {searchState.error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-destructive">
              <X className="w-4 h-4" />
              <span className="text-sm">{searchState.error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {debouncedKeyword && (
        <div className="space-y-4">
          {searchState.loading ? (
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-muted-foreground">
                    Đang tìm kiếm...
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : searchState.data.length > 0 ? (
            <div className="space-y-4">
              {searchState.data.map((item, index) => {
                const friendStatus = friendStatuses[item.id] || {
                  isFriend: false,
                  hasSentRequest: false,
                  hasReceivedRequest: false,
                  loading: false,
                };

                return (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">
                              {item.displayName || item.handle}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              @{item.handle}
                            </p>
                          </div>
                        </div>

                        {/* Friend Action Button */}
                        <div className="flex-shrink-0">
                          {friendStatus.isFriend ? (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <UserCheck className="w-3 h-3" />
                              Bạn bè
                            </Badge>
                          ) : friendStatus.hasSentRequest ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleCancelFriendRequest(
                                  item.id,
                                  friendStatus.requestId!
                                )
                              }
                              disabled={friendStatus.loading}
                              className="flex items-center gap-1"
                            >
                              {friendStatus.loading ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <UserMinus className="w-3 h-3" />
                              )}
                              Đã gửi
                            </Button>
                          ) : friendStatus.hasReceivedRequest ? (
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              <UserPlus className="w-3 h-3" />
                              Lời mời
                            </Badge>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleSendFriendRequest(item.id)}
                              disabled={friendStatus.loading}
                              className="flex items-center gap-1"
                            >
                              {friendStatus.loading ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <UserPlus className="w-3 h-3" />
                              )}
                              Kết bạn
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Pagination */}
              {searchState.totalCount > searchState.pageSize && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(searchState.pageNumber - 1)}
                    disabled={searchState.pageNumber <= 1}
                  >
                    Trước
                  </Button>
                  <Badge variant="secondary">
                    Trang {searchState.pageNumber}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(searchState.pageNumber + 1)}
                    disabled={
                      searchState.pageNumber * searchState.pageSize >=
                      searchState.totalCount
                    }
                  >
                    Sau
                  </Button>
                </div>
              )}
            </div>
          ) : !searchState.loading && !searchState.error ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Không tìm thấy kết quả
                </h3>
                <p className="text-muted-foreground">
                  Thử tìm kiếm với từ khóa khác hoặc kiểm tra chính tả
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchInterface;
