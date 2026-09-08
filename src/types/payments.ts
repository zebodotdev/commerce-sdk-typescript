import type { BalanceTransaction } from './balance-transactions';
import type { JSONData } from './custom-data';
import type { Amount } from './money';
import type { PaymentMethod } from './payment-methods';

export const PaymentStatuses = {
  Initiated: 'initiated',
  RequiresAction: 'requires_action',
  Overdue: 'overdue',
  Executed: 'executed',
  Paid: 'paid',
  Canceled: 'canceled',
  Expired: 'expired',
  Failed: 'failed',
  Unknown: 'unknown',
} as const;
export type PaymentStatus = (typeof PaymentStatuses)[keyof typeof PaymentStatuses];

export const PaymentAttemptStatuses = {
  Initiated: 'initiated',
  Executed: 'executed',
  Succeeded: 'succeeded',
  Canceled: 'canceled',
  Expired: 'expired',
  Failed: 'failed',
  Unknown: 'unknown',
} as const;
export type PaymentAttemptStatus =
  (typeof PaymentAttemptStatuses)[keyof typeof PaymentAttemptStatuses];

export const PaymentConfirmationChannels = { Sms: 'sms', Email: 'email', Push: 'push' } as const;
export type PaymentConfirmationChannel =
  (typeof PaymentConfirmationChannels)[keyof typeof PaymentConfirmationChannels];

export const CheckoutPaymentStatuses = {
  RequiresAction: 'requires_action',
  Processing: 'processing',
  Succeeded: 'succeeded',
  Failed: 'failed',
  Cancelled: 'cancelled',
} as const;
export type CheckoutPaymentStatus =
  (typeof CheckoutPaymentStatuses)[keyof typeof CheckoutPaymentStatuses];

export const PaymentResultStatuses = {
  Pending: 'pending',
  RequiresConfirmation: 'requires_confirmation',
  Processing: 'processing',
  Succeeded: 'succeeded',
  Failed: 'failed',
} as const;
export type PaymentResultStatus =
  (typeof PaymentResultStatuses)[keyof typeof PaymentResultStatuses];

/** Payout configuration attached to a payment. */
export interface PaymentPayoutConfiguration {
  enableFx?: boolean;
  destination?: {
    financialAccountId?: string;
  };
}

/** Latest attempt to execute a payment. */
export interface PaymentAttempt {
  paymentMethodType?: PaymentMethod['type'];
  paymentMethodId?: string;
  reference?: string;
  status?: PaymentAttemptStatus;
  initiatedAt?: string;
  succeededAt?: string;
}

/** A payment collected for an order. */
export interface Payment {
  id?: string;
  status?: PaymentStatus;
  statementDescriptor?: string;
  amount?: Amount;
  paymentMethod?: PaymentMethod;
  latestAttempt?: PaymentAttempt;
  nextAction?: PaymentNextAction | null;
  payoutConfiguration?: PaymentPayoutConfiguration | null;
  balanceTransaction?: BalanceTransaction | null;
  initiatedAt?: string;
  executedAt?: string;
  paidAt?: string;
  failedAt?: string;
}

export const PaymentNextActionTypes = {
  ConfirmPayment: 'confirm_payment',
  Execute: 'execute',
  Redirect: 'redirect',
  Authorize: 'authorize',
  None: 'none',
} as const;
export type PaymentNextActionType =
  (typeof PaymentNextActionTypes)[keyof typeof PaymentNextActionTypes];

export interface PaymentNextAction {
  type: PaymentNextActionType;
  confirmPayment?: {
    expiresAt: string;
    scheme?: string;
    request?: {
      id: string;
      recipient: string;
      sentVia: PaymentConfirmationChannel;
      tokenSize: number;
      senderId: string;
    };
  };
  execute?: JSONData;
  redirect?: {
    url: string;
  };
}
