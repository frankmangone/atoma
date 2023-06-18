export interface Paginated<T> {
  data: T[];
  prevCursor: string;
  nextCursor: string;
}
