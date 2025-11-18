import axiosConnected from "@/lib/axios";
import { PageResult, searchItem, searchRequest } from "./search.types";

export const searchService = {
  /**
   * Search users with pagination
   * @param data seach request parameters
   * @returns PageResult with search items
   */

  async search(data: searchRequest): Promise<PageResult<searchItem>> {
    const response = await axiosConnected.get("/api/UserSearch/search-paging", {
      params: {
        keyword: data.keyword,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize,
      },
    });

    return response.data;
  },

  async searchWithConfig(
    keyword: string,
    pageNumber: number = 1,
    pageSize: number = 10,
    signal?: AbortSignal
  ): Promise<PageResult<searchItem>> {
    const response = await axiosConnected.get("/api/UserSearch/search-paging", {
      params: { keyword, pageNumber, pageSize },
      signal,
    });

    return response.data;
  },
};
