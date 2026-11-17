export interface CursorPaginatedResult<T> {
  data: T[];
  nextCursor: string | null;
}
