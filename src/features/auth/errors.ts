/**
 * Custom error classes for authentication
 * Provides consistent error handling across the app
 */

import { AxiosError } from 'axios';

export interface ApiErrorDetails {
  field?: string;
  message: string;
}

export class ApiError extends Error {
  status: number;
  code: string;
  details?: ApiErrorDetails[];

  constructor(message: string, status: number, code: string, details?: ApiErrorDetails[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized access', details?: ApiErrorDetails[]) {
    super(message, 401, 'UNAUTHORIZED', details);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Access forbidden', details?: ApiErrorDetails[]) {
    super(message, 403, 'FORBIDDEN', details);
    this.name = 'ForbiddenError';
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Validation failed', details?: ApiErrorDetails[]) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Network error occurred') {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class ServerError extends ApiError {
  constructor(message = 'Internal server error', status = 500) {
    super(message, status, 'SERVER_ERROR');
    this.name = 'ServerError';
  }
}

/**
 * Normalizes Axios errors into consistent ApiError instances
 */
export function normalizeAxiosError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof AxiosError) {
    const status = error.response?.status || 0;
    const data = error.response?.data;

    // No response (network error)
    if (!error.response) {
      return new NetworkError(error.message);
    }

    // Extract error details
    const details: ApiErrorDetails[] = [];
    if (data && typeof data === 'object') {
      Object.entries(data).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach(msg => details.push({ field, message: msg }));
        } else if (typeof messages === 'string') {
          details.push({ field, message: messages });
        }
      });
    }

    const message = data?.message || data?.detail || error.message;

    // Map to specific error types
    switch (status) {
      case 401:
        return new UnauthorizedError(message, details);
      case 403:
        return new ForbiddenError(message, details);
      case 400:
        return new ValidationError(message, details);
      case 500:
      case 502:
      case 503:
        return new ServerError(message, status);
      default:
        return new ApiError(message, status, `HTTP_${status}`, details);
    }
  }

  // Unknown error
  return new ApiError(
    error instanceof Error ? error.message : 'An unknown error occurred',
    500,
    'UNKNOWN_ERROR'
  );
}
