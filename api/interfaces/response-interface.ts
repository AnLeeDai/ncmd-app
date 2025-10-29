export interface ResponseInterface<T> {
  message: string;
  data: T;
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
  token?: string;
  timestamp: string;
}

export interface ErrorResponseInterface {
  message: string;
  data: null;
  timestamp: string;
}
