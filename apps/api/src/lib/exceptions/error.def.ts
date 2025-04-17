export interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
  code?: string;
}
