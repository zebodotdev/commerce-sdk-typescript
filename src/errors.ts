/**
 * Custom error classes for the Inttegro SDK
 */
import type { ErrorReport } from './error-reporting';

/**
 * API error document structure
 */
export interface APIErrorPayload {
  type?: string;
  code?: string;
  url?: string;
  message?: string;
  detail?: string;
  fixCode?: string;
  cause?: string;
}

export interface APIErrorDocument {
  error?: APIErrorPayload;
  message?: string;
  code?: string;
  type?: string;
  url?: string;
  detail?: string;
  fixCode?: string;
  cause?: string;
}

/**
 * Base error class for all Inttegro API errors
 */
export class InttegroAPIError extends Error {
  /** HTTP status code */
  public readonly statusCode?: number;
  /** Error code from API */
  public readonly code?: string;
  /** Error type */
  public readonly type?: string;
  /** Error reference URL */
  public readonly url?: string;
  /** Detailed error explanation */
  public readonly detail?: string;
  /** Suggested resolution */
  public readonly fixCode?: string;
  /** Underlying category of failure */
  public readonly cause?: string;
  /** Original decoded API error document */
  public readonly errorDocument?: APIErrorDocument;
  /** API request identifier, when returned by the server. */
  public readonly requestId?: string;
  /** Privacy-safe report generated only when error reporting is configured. */
  public report?: ErrorReport;

  constructor(
    message: string,
    statusCode?: number,
    code?: string,
    type?: string,
    url?: string,
    detail?: string,
    fixCode?: string,
    cause?: string,
    errorDocument?: APIErrorDocument,
    requestId?: string
  ) {
    super(message);
    this.name = 'InttegroAPIError';
    this.statusCode = statusCode;
    this.code = code;
    this.type = type;
    this.url = url;
    this.detail = detail;
    this.fixCode = fixCode;
    this.cause = cause;
    this.errorDocument = errorDocument;
    this.requestId = requestId;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InttegroAPIError);
    }

    Object.setPrototypeOf(this, InttegroAPIError.prototype);
  }

  /**
   * Create error from API response
   */
  static fromResponse(
    statusCode: number,
    response: APIErrorDocument,
    requestId?: string
  ): InttegroAPIError {
    const payload = resolveAPIErrorPayload(response);
    const message =
      payload.message || payload.detail || response.message || 'An unknown error occurred';
    const code = payload.code || response.code;
    const type = payload.type || response.type;
    const url = payload.url || response.url;
    const detail = payload.detail || response.detail;
    const fixCode = payload.fixCode || response.fixCode;
    const cause = payload.cause || response.cause;

    // Return specific error types based on status code
    if (statusCode >= 400 && statusCode < 500) {
      return new InttegroValidationError(
        message,
        statusCode,
        code,
        type,
        url,
        detail,
        fixCode,
        cause,
        response,
        requestId
      );
    }

    return new InttegroAPIError(
      message,
      statusCode,
      code,
      type,
      url,
      detail,
      fixCode,
      cause,
      response,
      requestId
    );
  }
}

/**
 * Validation error for invalid request parameters
 * Typically thrown for 4xx status codes
 */
export class InttegroValidationError extends InttegroAPIError {
  constructor(
    message: string,
    statusCode?: number,
    code?: string,
    type?: string,
    url?: string,
    detail?: string,
    fixCode?: string,
    cause?: string,
    errorDocument?: APIErrorDocument,
    requestId?: string
  ) {
    super(message, statusCode, code, type, url, detail, fixCode, cause, errorDocument, requestId);
    this.name = 'InttegroValidationError';
    Object.setPrototypeOf(this, InttegroValidationError.prototype);
  }
}

/**
 * Network error for connection and timeout issues
 */
export class InttegroNetworkError extends Error {
  /** Original error that caused the network failure */
  public readonly cause?: Error;
  /** Whether the error was due to a timeout */
  public readonly isTimeout: boolean;
  /** Privacy-safe report generated only when error reporting is configured. */
  public report?: ErrorReport;

  constructor(message: string, cause?: Error, isTimeout = false) {
    super(message);
    this.name = 'InttegroNetworkError';
    this.cause = cause;
    this.isTimeout = isTimeout;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InttegroNetworkError);
    }

    Object.setPrototypeOf(this, InttegroNetworkError.prototype);
  }
}

/**
 * Authentication error for invalid credentials
 */
export class InttegroAuthenticationError extends InttegroAPIError {
  constructor(
    message: string,
    statusCode = 401,
    code?: string,
    type?: string,
    url?: string,
    detail?: string,
    fixCode?: string,
    cause?: string,
    errorDocument?: APIErrorDocument,
    requestId?: string
  ) {
    super(
      message,
      statusCode,
      code,
      type || 'authentication_error',
      url,
      detail,
      fixCode,
      cause,
      errorDocument,
      requestId
    );
    this.name = 'InttegroAuthenticationError';
    Object.setPrototypeOf(this, InttegroAuthenticationError.prototype);
  }
}

/**
 * Rate limit error
 */
export class InttegroRateLimitError extends InttegroAPIError {
  /** When the rate limit resets (timestamp) */
  public readonly retryAfter?: number;

  constructor(
    message: string,
    statusCode = 429,
    retryAfter?: number,
    code?: string,
    type?: string,
    url?: string,
    detail?: string,
    fixCode?: string,
    cause?: string,
    errorDocument?: APIErrorDocument,
    requestId?: string
  ) {
    super(
      message,
      statusCode,
      code || 'rate_limit',
      type || 'rate_limit_error',
      url,
      detail,
      fixCode,
      cause,
      errorDocument,
      requestId
    );
    this.name = 'InttegroRateLimitError';
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, InttegroRateLimitError.prototype);
  }
}

function resolveAPIErrorPayload(response: APIErrorDocument): APIErrorPayload {
  if (response.error) {
    return response.error;
  }
  return {
    type: response.type,
    code: response.code,
    url: response.url,
    message: response.message,
    detail: response.detail,
    fixCode: response.fixCode,
    cause: response.cause,
  };
}
