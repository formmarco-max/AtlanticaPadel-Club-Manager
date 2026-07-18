import type { PaginationMeta } from './pagination-meta.interface';

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}