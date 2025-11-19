"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { searchService } from "@/services/user_info/search.service";
import { searchItem } from "@/services/user_info/search.types";
import { AxiosError } from "axios";

import Card from "./Card";

interface SearchState {
  data: searchItem[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

interface TaskSearchProps {
  initialQuery?: string;
}

const TaskSearch: React.FC<TaskSearchProps> = ({ initialQuery = "" }) => {
  const router = useRouter();
  const [keywords, setKeywords] = useState<string>(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const debouncedKeyword = useDebounce(keywords, 300); // Faster debounce for better UX
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
        console.group("🔍 API Search Request");
        console.log("📝 Keyword:", debouncedKeyword);
        console.log("📄 Page:", searchState.pageNumber);
        console.log("📊 Page Size:", searchState.pageSize);

        const response = await searchService.search({
          keyword: debouncedKeyword,
          pageNumber: searchState.pageNumber,
          pageSize: searchState.pageSize,
        });

        console.log("✅ Full Response:", response);

        // ✅ FIX: Handle nested data structure
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

        console.log("📦 Items:", items);
        console.log("🔢 Total Count:", totalCount);
        console.groupEnd();

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
            console.log("🚫 Request cancelled");
            return;
          }
        }

        console.error("❌ Search Error:", error);

        // Extract error message
        let errorMessage = "Đã có lỗi xảy ra khi tìm kiếm";

        if (error instanceof AxiosError) {
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
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
        } else if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === "string") {
          errorMessage = error;
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
        const updated = [trimmedKeyword, ...filtered].slice(0, 5); // Keep only 5 recent
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

  return (
    <div className="w-full py-6 relative">
      {/* Search Form with Enhanced Style */}
      <form className="max-w-md m-10" onSubmit={handleSubmit}>
        <label
          htmlFor="search"
          className="block mb-2.5 text-sm font-medium text-gray-900 dark:text-white sr-only"
        >
          Search
        </label>

        <div className="relative">
          {/* Search Icon */}
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className={`w-4 h-4 transition-colors ${
                keywords
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>

          {/* Search Input with Improved Styling */}
          <input
            ref={inputRef}
            type="search"
            id="search"
            value={keywords}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className="block w-full p-3 ps-9 pe-24 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Tìm kiếm người dùng theo tên hoặc handle..."
            autoComplete="off"
          />

          {/* Clear Button */}
          {keywords && !searchState.loading && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute end-16 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear search"
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
          )}

          {/* Search Button with Loading State */}
          <button
            type="submit"
            disabled={!keywords.trim() || searchState.loading}
            className="absolute end-1.5 top-1/2 -translate-y-1/2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-4 py-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {searchState.loading ? (
              <span className="flex items-center gap-1.5">
                <svg
                  className="animate-spin h-3.5 w-3.5"
                  xmlns="http://www.w3.org/2000/svg"
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
                <span className="hidden sm:inline">Đang tìm...</span>
              </span>
            ) : (
              "Search"
            )}
          </button>
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            {/* Recent Searches */}
            {recentSearches.length > 0 && !keywords.trim() && (
              <div className="p-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Tìm kiếm gần đây
                  </span>
                  <button
                    onClick={handleClearAllRecent}
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Xóa tất cả
                  </button>
                </div>
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer group"
                    onClick={() => handleSuggestionClick(search)}
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm">{search}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearRecentSearch(search);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      aria-label={`Xóa tìm kiếm: ${search}`}
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Search Tips */}
            {keywords.trim() && (
              <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  💡 Mẹo: Nhập tên hoặc handle để tìm kiếm chính xác hơn
                </div>
              </div>
            )}
          </div>
        )}

        {/* Keyboard Shortcut Hint */}
        {keywords && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
              Enter
            </kbd>
            <span>để xem kết quả chi tiết</span>
          </div>
        )}
      </form>

      {/* Enhanced Search Stats */}
      {debouncedKeyword &&
        !searchState.loading &&
        searchState.data.length > 0 && (
          <div className="max-w-md mx-auto mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium text-blue-900 dark:text-blue-100">
                  {searchState.totalCount}
                </span>
                <span className="text-blue-700 dark:text-blue-300">
                  kết quả tìm thấy
                </span>
              </div>
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <span>Trang {searchState.pageNumber}</span>
                <span>•</span>
                <span>{searchState.data.length} hiển thị</span>
              </div>
            </div>
          </div>
        )}

      {/* Results Section */}
      <div className="max-w-md mx-auto mt-6">
        <Card
          data={searchState.data}
          loading={searchState.loading}
          error={searchState.error}
          totalCount={searchState.totalCount}
          pageNumber={searchState.pageNumber}
          pageSize={searchState.pageSize}
          searchKeyword={debouncedKeyword}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TaskSearch;
