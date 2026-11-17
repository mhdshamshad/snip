export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

export interface CursorPaginatedData<T = unknown> {
  data: T[];
  nextCursor: string | null;
}

export interface CursorPaginatedResponse<T = unknown> {
  success: true;
  message: string;
  data: CursorPaginatedData<T>;
}

export type SortOrder = 'asc' | 'desc';
