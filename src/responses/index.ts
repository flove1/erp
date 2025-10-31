export interface ApiResponse<T = unknown> {
  data?: T;
  errors?: string[];
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}