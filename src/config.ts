import type { TracerProvider } from '@opentelemetry/api';
import type { ErrorReportingConfig } from './error-reporting';

/**
 * Configuration options for the Inttegro SDK
 */

/**
 * Retry configuration
 */
export interface RetryConfig {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Initial retry delay in milliseconds (default: 1000) */
  initialDelay?: number;
  /** Maximum retry delay in milliseconds (default: 10000) */
  maxDelay?: number;
  /** Multiplier for exponential backoff (default: 2) */
  backoffMultiplier?: number;
}

/**
 * Request interceptor function
 */
export type RequestInterceptor = (
  url: string,
  options: RequestInit
) => Promise<{ url: string; options: RequestInit }> | { url: string; options: RequestInit };

/**
 * Response interceptor function
 */
export type ResponseInterceptor = (response: Response) => Promise<Response> | Response;

/** OpenTelemetry integration. The SDK never configures an exporter. */
export interface TelemetryConfig {
  /** Emit SDK spans to the application's tracer provider (default: true). */
  enabled?: boolean;
  /** Optional provider override. The global OpenTelemetry provider is used by default. */
  tracerProvider?: TracerProvider;
}

/**
 * SDK Configuration
 */
export interface InttegroConfig {
  /** API key for authentication (required) */
  apiKey: string;
  /** Base URL for the API (default: https://api.inttegro.com) */
  baseUrl?: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Retry configuration */
  retry?: RetryConfig;
  /** Enable debug logging (default: false) */
  debug?: boolean;
  /** Vendor-neutral SDK tracing. No telemetry is exported unless the application configures it. */
  telemetry?: TelemetryConfig;
  /** Optional application-owned destination for privacy-safe SDK failure reports. */
  errorReporting?: ErrorReportingConfig;
  /** Request interceptors */
  requestInterceptors?: RequestInterceptor[];
  /** Response interceptors */
  responseInterceptors?: ResponseInterceptor[];
}

/**
 * Default configuration values
 */
export type ResolvedInttegroConfig = Required<
  Omit<InttegroConfig, 'apiKey' | 'telemetry' | 'errorReporting'>
> & {
  apiKey: string;
  telemetry: TelemetryConfig & { enabled: boolean };
  errorReporting?: ErrorReportingConfig;
};

export const DEFAULT_CONFIG: Omit<ResolvedInttegroConfig, 'apiKey'> = {
  baseUrl: 'https://api.inttegro.com',
  timeout: 30000,
  retry: {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  },
  debug: false,
  telemetry: { enabled: true },
  requestInterceptors: [],
  responseInterceptors: [],
};
