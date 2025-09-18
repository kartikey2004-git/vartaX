class ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: T, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };

// The ApiResponse class standardizes API responses by encapsulating status codes, data, messages, and success indicators. This ensures consistent response structures across the application, making it easier for clients to handle and interpret responses.
