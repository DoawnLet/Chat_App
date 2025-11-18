export interface searchItem {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
}

// ✅ Update PageResult to match backend response
export interface PageResult<T> {
  data: {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  flag: boolean;
  message: string;
}

// Or use this if you want separate interfaces
export interface ApiResponse<T> {
  data: PageData<T>;
  flag: boolean;
  message: string;
}

export interface PageData<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface searchRequest {
  keyword: string;
  pageNumber: number;
  pageSize: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: string;
}
