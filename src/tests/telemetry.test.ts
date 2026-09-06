import type { Span, TracerProvider } from '@opentelemetry/api';
import { propagation, SpanKind } from '@opentelemetry/api';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HttpClient } from '../http-client';
import { Telemetry } from '../telemetry';
import { SDK_VERSION } from '../version';
import type { ErrorReport } from '../error-reporting';

type RecordedEvent = { name: string; attributes?: Record<string, unknown> };

class RecordedSpan {
  readonly attributes: Record<string, unknown> = {};
  readonly events: RecordedEvent[] = [];
  status: unknown;
  ended = false;

  setAttribute(key: string, value: unknown): this {
    this.attributes[key] = value;
    return this;
  }

  addEvent(name: string, attributes?: Record<string, unknown>): this {
    this.events.push({ name, attributes });
    return this;
  }

  setStatus(status: unknown): this {
    this.status = status;
    return this;
  }

  end(): void {
    this.ended = true;
  }

  spanContext(): { traceId: string; spanId: string; traceFlags: number } {
    return {
      traceId: '4bf92f3577b34da6a3ce929d0e0e4736',
      spanId: '00f067aa0ba902b7',
      traceFlags: 1,
    };
  }
}

function recordingProvider(records: Array<{ name: string; options: unknown; span: RecordedSpan }>) {
  return {
    getTracer: () => ({
      startActiveSpan: (name: string, options: unknown, callback: (span: Span) => unknown) => {
        const span = new RecordedSpan();
        records.push({ name, options, span });
        return callback(span as unknown as Span);
      },
    }),
  } as unknown as TracerProvider;
}

afterEach(() => {
  propagation.disable();
  vi.restoreAllMocks();
});

describe('OpenTelemetry integration', () => {
  it('falls back to a bounded operation for an unknown or dynamic route', async () => {
    const records: Array<{ name: string; options: unknown; span: RecordedSpan }> = [];
    const telemetry = new Telemetry({ tracerProvider: recordingProvider(records) }, SDK_VERSION);

    await telemetry.request(
      '/orders/or_private_123',
      'GET',
      'https://api.inttegro.com',
      SDK_VERSION,
      async () => undefined
    );

    expect(records[0].name).toBe('inttegro.http.request');
    expect(JSON.stringify(records[0])).not.toContain('or_private_123');
  });

  it('emits a redacted logical operation span and propagates trace context', async () => {
    const records: Array<{ name: string; options: unknown; span: RecordedSpan }> = [];
    propagation.setGlobalPropagator({
      fields: () => ['traceparent'],
      inject: (_context, carrier, setter) => {
        setter.set(
          carrier,
          'traceparent',
          '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01'
        );
      },
      extract: (context) => context,
    });
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ balances: {} }), {
        status: 200,
        headers: { 'content-type': 'application/json', 'x-request-id': 'req_123' },
      })
    );
    const client = new HttpClient({
      apiKey: 'sk_live_must_not_appear',
      telemetry: { tracerProvider: recordingProvider(records) },
    });

    await client.post('/balances', { customer_email: 'private@example.com' });

    expect(records).toHaveLength(1);
    expect(records[0].name).toBe('inttegro.balances.lookup');
    expect(records[0].options).toMatchObject({ kind: SpanKind.CLIENT });
    expect(records[0].span.attributes).toMatchObject({
      'http.response.status_code': 200,
      'inttegro.request.id': 'req_123',
    });
    expect(records[0].span.events.map((event) => event.name)).toEqual([
      'inttegro.request.prepared',
      'inttegro.http.attempt.started',
      'inttegro.response.received',
      'inttegro.response.decoded',
    ]);
    expect(records[0].span.ended).toBe(true);

    const requestHeaders = new Headers(fetchMock.mock.calls[0][1]?.headers);
    expect(requestHeaders.get('traceparent')).toBe(
      '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01'
    );
    const telemetry = JSON.stringify(records);
    expect(telemetry).not.toContain('sk_live_must_not_appear');
    expect(telemetry).not.toContain('private@example.com');
  });

  it('records retries without recording the response body', async () => {
    const records: Array<{ name: string; options: unknown; span: RecordedSpan }> = [];
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: 'sensitive provider detail' }), {
          status: 503,
          headers: { 'content-type': 'application/json' },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ order: { id: 'ord_123' } }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );
    const client = new HttpClient({
      apiKey: 'test',
      retry: { maxRetries: 1, initialDelay: 0, maxDelay: 0 },
      telemetry: { tracerProvider: recordingProvider(records) },
    });

    await client.post('/orders/lookup', { orderId: 'ord_123' });

    const retry = records[0].span.events.find((event) => event.name === 'inttegro.retry.scheduled');
    expect(retry?.attributes).toMatchObject({
      'http.request.resend_count': 1,
      'inttegro.retry.delay_ms': 0,
      'error.type': 'http_503',
    });
    expect(JSON.stringify(records)).not.toContain('sensitive provider detail');
  });

  it('reports one privacy-safe final failure only when a reporter is configured', async () => {
    const reports: ErrorReport[] = [];
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            type: 'transient_error',
            code: 'provider_failed',
            fixCode: 'repeat_same_request',
            message: 'private provider detail',
          },
        }),
        {
          status: 503,
          headers: { 'content-type': 'application/json', 'x-request-id': 'req_456' },
        }
      )
    );
    const client = new HttpClient({
      apiKey: 'sk_live_must_not_appear',
      retry: { maxRetries: 0 },
      telemetry: { enabled: false },
      errorReporting: {
        reporter: (report) => {
          reports.push(report);
          throw new Error('collector unavailable');
        },
      },
    });

    await expect(client.post('/orders/lookup', { orderId: 'ord_private' })).rejects.toMatchObject({
      statusCode: 503,
      requestId: 'req_456',
    });

    expect(reports).toHaveLength(1);
    expect(reports[0]).toMatchObject({
      schemaVersion: 1,
      category: 'http_503',
      operation: 'orders.lookup',
      sdk: { language: 'typescript', version: SDK_VERSION },
      http: {
        method: 'POST',
        route: '/orders/lookup',
        serverAddress: 'api.inttegro.com',
        statusCode: 503,
        requestId: 'req_456',
      },
      apiError: {
        type: 'transient_error',
        code: 'provider_failed',
        fixCode: 'repeat_same_request',
      },
    });
    expect(reports[0]?.fingerprint).toBe('inttegro:typescript:orders.lookup:http_503:503');
    expect(JSON.stringify(reports)).not.toContain('private provider detail');
    expect(JSON.stringify(reports)).not.toContain('sk_live_must_not_appear');
    expect(JSON.stringify(reports)).not.toContain('ord_private');
  });

  it('does not prepare default reports for expected API errors', async () => {
    const reporter = vi.fn();
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: { type: 'invalid_request_parameter' } }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      })
    );
    const client = new HttpClient({
      apiKey: 'test',
      retry: { maxRetries: 0 },
      telemetry: { enabled: false },
      errorReporting: { reporter },
    });

    const error = await client.get('/orders/lookup').catch((caught: unknown) => caught);
    expect(error).toMatchObject({ statusCode: 400 });
    expect((error as { report?: ErrorReport }).report).toBeUndefined();
    expect(reporter).not.toHaveBeenCalled();
  });
});
