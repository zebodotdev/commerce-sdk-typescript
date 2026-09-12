import { describe, expect, it } from 'vitest';
import {
  Order,
  OrderStatuses,
  Payment,
  PaymentMethod,
  PaymentNextActionTypes,
  PaymentStatuses,
  Product,
  ProductTypes,
  PurchaseIntent,
  PurchaseIntentStatuses,
} from '../index';

describe('resource semantics', () => {
  it('answers payment and order lifecycle questions', () => {
    const payment = {
      id: 'py_123',
      statementDescriptor: 'INTTEGRO',
      amount: { currency: 'ghs', value: 1000 },
      status: PaymentStatuses.RequiresAction,
      initiatedAt: new Date(),
      nextAction: { type: PaymentNextActionTypes.Redirect },
    } as Payment;
    const order = {
      id: 'or_123',
      status: OrderStatuses.RequiresPayment,
      customer: { id: 'cu_123', guest: false, name: 'Ama' },
      initiatedAt: new Date(),
      payment,
    } as Order;

    expect(Payment.requiresAction(payment)).toBe(true);
    expect(Payment.isTerminal(payment)).toBe(false);
    expect(Payment.requiredAction(payment)).toBe(payment.nextAction);
    expect(Order.requiresPayment(order)).toBe(true);
    expect(Order.requiredPaymentAction(order)).toBe(payment.nextAction);
  });

  it('answers catalog and payment-method questions', () => {
    const intent = {
      status: PurchaseIntentStatuses.Used,
      usage: { singleUse: true, order: { id: 'or_123', createdAt: new Date() } },
    } as PurchaseIntent;
    const product = {
      active: true,
      type: ProductTypes.Digital,
      publishedAt: new Date(),
    } as Product;
    const method = { active: true, ephemeral: false, verifiedAt: new Date() } as PaymentMethod;

    expect(PurchaseIntent.isSingleUse(intent)).toBe(true);
    expect(PurchaseIntent.usedOrderId(intent)).toBe('or_123');
    expect(Product.isPublished(product)).toBe(true);
    expect(Product.wasEverPublished(product)).toBe(true);
    expect(PaymentMethod.isVerified(method)).toBe(true);
    expect(PaymentMethod.isReusable(method)).toBe(true);
  });
});
