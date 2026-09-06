import type { Span } from '@opentelemetry/api';
import { InttegroAPIError } from './errors';

export type ErrorReportingPolicy = 'unexpected' | 'all';

/** A privacy-safe description of a failed Inttegro SDK operation. */
export interface ErrorReport {
  readonly schemaVersion: 1;
  readonly eventId: string;
  readonly occurredAt: string;
  readonly severity: 'error';
  readonly category: string;
  readonly operation: string;
  readonly sdk: {
    readonly language: 'typescript';
    readonly version: string;
  };
  readonly http: {
    readonly method: string;
    readonly route?: string;
    readonly serverAddress: string;
    readonly statusCode?: number;
    readonly requestId?: string;
    readonly durationMs: number;
  };
  readonly apiError?: {
    readonly type?: string;
    readonly code?: string;
    readonly fixCode?: string;
  };
  readonly trace?: {
    readonly traceId: string;
    readonly spanId: string;
  };
  readonly exceptionType: string;
  readonly fingerprint: string;
}

/** Receives reports after a logical SDK operation finally fails. */
export type ErrorReporter = (report: ErrorReport) => void | Promise<void>;

export interface ErrorReportingConfig {
  reporter: ErrorReporter;
  /** Report only unexpected failures by default, or every SDK failure. */
  policy?: ErrorReportingPolicy;
}

interface ReportInput {
  error: unknown;
  category: string;
  operation: string;
  method: string;
  route?: string;
  serverAddress: string;
  version: string;
  durationMs: number;
  span?: Span;
}

export function shouldReport(
  error: unknown,
  category: string,
  policy: ErrorReportingPolicy
): boolean {
  if (category === 'canceled') return false;
  if (policy === 'all') return true;
  if (error instanceof InttegroAPIError) {
    return (error.statusCode ?? 0) >= 500 || error.type === 'unknown_error';
  }
  return true;
}

export function createErrorReport(input: ReportInput): ErrorReport {
  const apiError = input.error instanceof InttegroAPIError ? input.error : undefined;
  const spanContext = input.span?.spanContext();
  const statusCode = apiError?.statusCode;
  const apiContext =
    apiError?.type || apiError?.code || apiError?.fixCode
      ? { type: apiError.type, code: apiError.code, fixCode: apiError.fixCode }
      : undefined;
  const traceContext =
    spanContext?.traceId && spanContext.spanId
      ? { traceId: spanContext.traceId, spanId: spanContext.spanId }
      : undefined;
  const report: ErrorReport = {
    schemaVersion: 1,
    eventId: createEventId(),
    occurredAt: new Date().toISOString(),
    severity: 'error',
    category: input.category,
    operation: input.operation,
    sdk: { language: 'typescript', version: input.version },
    http: {
      method: input.method.toUpperCase(),
      route: input.route,
      serverAddress: input.serverAddress,
      statusCode,
      requestId: apiError?.requestId,
      durationMs: Math.max(0, Math.round(input.durationMs)),
    },
    apiError: apiContext,
    trace: traceContext,
    exceptionType: exceptionType(input.error),
    fingerprint: [
      'inttegro',
      'typescript',
      input.operation,
      input.category,
      statusCode ?? 'none',
    ].join(':'),
  };
  return report;
}

export function submitErrorReport(reporter: ErrorReporter, report: ErrorReport): void {
  try {
    const result = reporter(report);
    if (result && typeof result.then === 'function') void result.catch(() => undefined);
  } catch {
    // Reporting must never replace the operation's original failure.
  }
}

function exceptionType(error: unknown): string {
  if (error instanceof Error && error.constructor.name) return error.constructor.name;
  return typeof error;
}

function createEventId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') return globalThis.crypto.randomUUID();
  return `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}
