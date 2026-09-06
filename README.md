# Inttegro TypeScript SDK

[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/zebodotdev/inttegro-sdk-typescript/badge)](https://scorecard.dev/viewer/?uri=github.com/zebodotdev/inttegro-sdk-typescript)

The official TypeScript client for building server-side Inttegro integrations.

> **Fastest, most modern path:** connect an agent to [Inttegro MCP](https://studio.inttegro.com/inttegro-mcp) at `https://mcp.inttegro.com`, then ask it to run `design_integration`. It will produce an implementation and test plan for your application. Use this SDK when you are ready to connect that plan to your TypeScript runtime.

All official Inttegro SDKs expose the same API capabilities. This package adds TypeScript-specific types, tooling, and runtime controls.

## Install

Requires Node.js 24 or newer.

```bash
npm install @inttegro/inttegro-sdk
```

Store your secret key in the server environment:

```bash
export INTTEGRO_API_KEY="your_secret_key"
```

Never put the key in browser code, a mobile app, or source control. The client uses `https://api.inttegro.com` by default.

## Create a hosted checkout

Create and finalize an order, then send the customer to its hosted invoice URL:

```ts
import { Currencies, InttegroClient, InttegroAPIError, ProductTypes } from '@inttegro/inttegro-sdk';

const inttegro = new InttegroClient({
  apiKey: process.env.INTTEGRO_API_KEY!,
});

try {
  const order = await inttegro.orders.create({
    requestMeta: { idempotencyKey: 'checkout-cart-123' },
    customerData: {
      name: 'Akua Mensah',
      emailAddress: 'akua@example.com',
      phoneNumber: '+233544998605',
    },
    finalize: true,
    checkoutSettings: {
      redirectUrl: 'https://example.com/orders/complete',
      cancelUrl: 'https://example.com/cart',
    },
    lineItems: [
      {
        type: 'product',
        product: {
          type: ProductTypes.Digital,
          name: 'Monthly subscription',
          quantity: 1,
          price: { currency: Currencies.GHS, value: 5000 },
        },
      },
    ],
  });

  const checkoutUrl = order.invoice?.format?.web?.url;
  if (!checkoutUrl) throw new Error('Order did not include a checkout URL');
  console.log(order.id, checkoutUrl);
} catch (error) {
  if (error instanceof InttegroAPIError) {
    console.error(error.code, error.detail ?? error.message);
  }
  throw error;
}
```

Amounts use integer minor units: `5000` GHS is GHS 50.00. Reuse the same idempotency key when retrying the same logical write. If you omit one, the SDK generates a UUIDv7 key for mutating calls.

## Observe SDK operations

The SDK emits vendor-neutral OpenTelemetry spans through your application's provider. It never configures an exporter or sends telemetry by itself. Configure OpenTelemetry at application startup; the global provider is used automatically, or you can pass a provider explicitly:

```ts
const inttegro = new InttegroClient({
  apiKey: process.env.INTTEGRO_API_KEY!,
  telemetry: { tracerProvider },
});
```

Spans are named after logical operations such as `inttegro.orders.create`. HTTP attempts, retries, response receipt, and decoding are span events. API keys, bodies, resource IDs, dynamic URLs, and exception messages are never recorded. See [SDK observability](https://studio.inttegro.com/sdk-observability) for the complete contract and disable tracing with `telemetry: { enabled: false }` when needed.

### Report SDK failures

Provide an application-owned reporter to receive one typed, privacy-safe report after an SDK operation finally fails. The default `unexpected` policy reports transport, timeout, decoding, SDK, `unknown_error`, and server-side failures while leaving normal 4xx API errors alone:

```ts
const inttegro = new InttegroClient({
  apiKey: process.env.INTTEGRO_API_KEY!,
  errorReporting: {
    reporter: (report) => errorCollector.enqueue(report),
  },
});
```

Use `policy: 'all'` to include expected API failures; cancellations are never reported. Reports contain the logical operation, static route, server host, status and request IDs when available, duration, safe API error codes, SDK identity, stable fingerprint, exception type, and trace IDs when tracing is active. They exclude credentials, headers, bodies, resource IDs, dynamic URLs, exception messages, and stack traces. Reporter failures are isolated and the original SDK error is still thrown.

Error reporting is completely opt-in. Without `errorReporting`, the SDK does not calculate report metadata, create an event ID or timestamp, allocate a report, or serialize a payload.

## Work with the API

The SDK covers orders and checkout, customers, products and prices, purchase intents, payment methods, balances, payouts and refunds, notifications, files, application settings, keys, and country specifications. Resources use camelCase properties such as `purchaseIntents` and `paymentMethods`.

TypeScript-specific features:

- Typed request and domain objects, plus exported constants for public enum values.
- Idiomatic camelCase fields throughout; the SDK translates to and from the API's snake_case JSON at the HTTP boundary.
- Promise-based resource methods with ESM and CommonJS builds.
- Platform `fetch` transport with the lightweight OpenTelemetry API for application-owned tracing.
- Configurable timeouts, exponential retries, debug logging, and request/response interceptors.
- Injectable configuration and interceptors for tests and observability.

See the [API reference](https://studio.inttegro.com/api-reference) for request fields and lifecycle rules, [errors](https://studio.inttegro.com/errors) for recovery guidance, and [idempotency](https://studio.inttegro.com/idempotency) for safe retries.

## Verify a release

The GitHub release for each version is the canonical record. It contains the exact npm tarball, its file list, SHA-256 checksums, and a Sigstore attestation tied to the source commit and release workflow. The npm package also includes the TypeScript source and source maps.

```bash
sha256sum --check SHA256SUMS
gh attestation verify inttegro-inttegro-sdk-8.1.0.tgz \
  --repo zebodotdev/inttegro-sdk-typescript
```

## Develop

```bash
npm ci
npm run typecheck
npm test
```
