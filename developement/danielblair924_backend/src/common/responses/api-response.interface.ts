export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export interface PaginationMeta {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

export interface PaginatedResponse<T = any> {
  status: 'success';
  data: {
    items: T[];
    pagination: PaginationMeta;
  };
  message?: string;
}

