/**
 * Inttegro SDK for TypeScript/JavaScript
 *
 * @packageDocumentation
 */

// Main client
export { InttegroClient } from './client';

// Configuration
export type {
  InttegroConfig,
  RetryConfig,
  TelemetryConfig,
  RequestInterceptor,
  ResponseInterceptor,
} from './config';
export type { ErrorReport, ErrorReporter, ErrorReportingPolicy } from './error-reporting';

// Error classes
export {
  InttegroAPIError,
  InttegroValidationError,
  InttegroNetworkError,
  InttegroAuthenticationError,
  InttegroRateLimitError,
} from './errors';
export type { APIErrorDocument } from './errors';

// Types
export * from './types';
export * as money from './types/money';
export * as payments from './types/payments';
export * as chimes from './types/chimes';
export * as wallets from './types/wallets';
export * as bankAccounts from './types/bank-accounts';

// Utilities
export { generateIdempotencyKey } from './utils/idempotency';
