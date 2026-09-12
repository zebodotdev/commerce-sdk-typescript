# Inttegro TypeScript SDK Examples

This directory contains practical examples demonstrating various features of the Inttegro SDK.

## Running the Examples

Before running any example, make sure you have:

1. Installed dependencies:

   ```bash
   npm install
   ```

2. Built the SDK:

   ```bash
   npm run build
   ```

3. Set your API key as an environment variable:
   ```bash
   export INTTEGRO_API_KEY=your-api-key
   ```

Then run any example using ts-node or tsx:

```bash
# Using tsx (recommended)
npx tsx examples/basic-order.ts

# Or using ts-node
npx ts-node examples/basic-order.ts
```

## Examples

### 1. Basic Order Creation

**File:** `basic-order.ts`

Demonstrates how to:

- Initialize the Inttegro SDK client
- Create an order with a new customer
- Add products and fees as line items
- Specify billing and shipping addresses
- Lookup order details

**Run:**

```bash
npx tsx examples/basic-order.ts
```

### 2. Mobile Money Payment

**File:** `mobile-money-payment.ts`

Demonstrates how to:

- Create an order
- Pay for an order using mobile money
- Handle payment confirmation requirements
- Check final payment status

**Run:**

```bash
npx tsx examples/mobile-money-payment.ts
```

### 3. Payment Confirmation Flow

**File:** `payment-confirmation.ts`

Demonstrates how to:

- Request confirmation codes (OTP)
- Prompt users for OTP input
- Confirm payments with OTP
- Resend confirmation codes
- Handle confirmation failures

**Run:**

```bash
npx tsx examples/payment-confirmation.ts
```

**Note:** This example includes interactive prompts for OTP entry.

### 4. Error Handling

**File:** `error-handling.ts`

Demonstrates how to:

- Handle validation errors
- Handle authentication errors
- Handle rate limiting
- Handle network errors
- Implement comprehensive error handling patterns

**Run:**

```bash
npx tsx examples/error-handling.ts
```

## Environment Variables

All examples support the following environment variables:

- `INTTEGRO_API_KEY` - Your Inttegro API key (required)
- `ORDER_ID` - Pre-existing order ID for confirmation examples (optional)

## Example Use Cases

### E-inttegro Checkout

Combine `basic-order.ts` and `mobile-money-payment.ts` to implement a complete checkout flow:

1. Create order when user clicks "Checkout"
2. Initiate payment when user selects payment method
3. Handle OTP confirmation if required
4. Show success/failure based on payment result

### Subscription Payments

Use saved payment methods with existing customers:

```typescript
const order = await inttegro.orders.create({
  customerId: 'cu_existing_123',
  paymentMethodId: 'pm_saved_456',
  payoutSettings: {
    destination: {
      financialAccountId: 'fa_1234567890abcdef',
    },
    enableFx: false,
  },
  lineItems: [
    /* subscription items */
  ],
  billingDetails: {
    /* billing info */
  },
});
```

### Order Status Tracking

Poll order status for real-time updates:

```typescript
async function trackOrder(orderId: string) {
  const interval = setInterval(async () => {
    const order = await inttegro.orders.lookup({ orderId: orderId });

    console.log('Status:', order.payment?.status);

    if (order.payment?.status === 'paid') {
      clearInterval(interval);
      console.log('Payment complete!');
    }
  }, 5000); // Check every 5 seconds
}
```

## Testing Examples

To test examples without making actual API calls, you can use the SDK's mock testing utilities:

```typescript
import { createMockFetch, mockCreateOrderResponse } from '../src/tests/mocks';

// Mock the fetch function
global.fetch = createMockFetch(mockCreateOrderResponse);

// Now run your example code
```

## Support

If you encounter any issues with these examples, please:

1. Check the main [README](../README.md) for setup instructions
2. Verify your API key is valid and has appropriate permissions
3. Review the [API documentation](https://studio.inttegro.com)
4. Open an issue on [GitHub](https://github.com/inttegro/inttegro-sdk-typescript/issues)
