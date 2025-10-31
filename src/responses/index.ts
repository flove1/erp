export interface ApiResponse<T = unknown> {
  data?: T;
  errors?: string[];
  error?: string;
}