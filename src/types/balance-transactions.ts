import type { Amount } from './money';

export interface PageBalanceTransactionsRequest {
  pageNumber?: number;
  pageSize?: number;
}

export interface LookupBalanceTransactionRequest {
  transactionId: string;
}

export interface PayoutConfiguration {
  enableFx: false;
  destination: {
    financialAccountId: string;
  };
}

export const BalanceTransactionTypes = { Payment: 'payment', Refund: 'refund' } as const;
export type BalanceTransactionType =
  (typeof BalanceTransactionTypes)[keyof typeof BalanceTransactionTypes];

interface BalanceTransactionBase {
  id: string;
  type: BalanceTransactionType;
  payoutId?: string;
  orderId: string;
  amount: Amount;
  createdAt: Date;
  availableAt?: Date;
  claimedAt?: Date;
  paidAt?: Date;
  payoutConfiguration?: PayoutConfiguration | null;
}

export interface PaymentBalanceTransaction extends BalanceTransactionBase {
  type: 'payment';
  paymentId: string;
  refundId?: never;
}

export interface RefundBalanceTransaction extends BalanceTransactionBase {
  type: 'refund';
  refundId: string;
  paymentId?: never;
}

export type BalanceTransaction = PaymentBalanceTransaction | RefundBalanceTransaction;

export interface BalanceTransactionPage {
  number: number;
  size: number;
  transactions?: BalanceTransaction[];
}
