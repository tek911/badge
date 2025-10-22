export interface PaginationQuery {
  size?: number;
  after?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  nextCursor?: string;
}

export const DEFAULT_PAGE_SIZE = 25;

export function normalizePagination(query: PaginationQuery): Required<PaginationQuery> {
  const size = Math.min(Math.max(query.size ?? DEFAULT_PAGE_SIZE, 1), 100);
  return { size, after: query.after ?? '' };
}
