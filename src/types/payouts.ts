import type { Amount } from './money';
import type { CustomData } from './custom-data';

export const PayoutStatuses = {
  Initialized: 'initialized',
  Scheduled: 'scheduled',
  Processing: 'processing',
  Executing: 'executing',
  Succeeded: 'succeeded',
  Invalid: 'invalid',
  Canceled: 'canceled',
} as const;
export type PayoutStatus = (typeof PayoutStatuses)[keyof typeof PayoutStatuses];

export interface PayoutScheduleSpec {
  tPlus?: string;
  label?: string;
  abide?: string;
}

export interface PayoutSchedule {
  id?: string;
  name?: string;
  type?: string;
  interval?: string;
  scheduleOn?: string;
  description?: string;
  spec?: PayoutScheduleSpec;
  agingSpec?: PayoutScheduleSpec;
}

export interface PayoutSettings {
  id?: string;
  fxEnabled?: boolean;
  destinations?: PayoutDestinations;
  schedule?: PayoutSchedule | null;
}

export type PayoutDestinations = Readonly<Record<string, string>>;

export interface SetPayoutDestinationsRequest {
  destinations: PayoutDestinations;
}

export interface SchedulePayoutRequest {
  destinationId: string;
  executeAfter?: Date;
  maxAmount: number;
  reference: string;
}

export interface LookupPayoutRequest {
  payoutId: string;
}

export interface PagePayoutsRequest {
  pageNumber?: number;
  pageSize?: number;
}

export interface PayoutError {
  type?: string;
  message?: string;
  cause?: string;
  occurredAt?: Date;
}

export interface Payout {
  id?: string;
  applicationId?: string;
  destinationId?: string;
  amount?: Amount;
  balanceTransactions?: string[];
  status?: PayoutStatus;
  initiatedBy?: string;
  executeAfter?: Date;
  scheduledAt?: Date;
  scheduledBy?: string;
  canceledAt?: Date;
  customData?: CustomData;
  error?: PayoutError | null;
  executedBy?: string;
  failedAt?: Date | null;
  maxAmount?: Amount;
  latestAttemptId?: string;
  latestError?: PayoutError;
  reference?: string;
  scheduleId?: string;
  sentAt?: Date | null;
  sourceId?: string;
  initiatedAt?: Date;
  executedAt?: Date;
  expectedAt?: Date;
  succeededAt?: Date;
  balanceTransactionIds?: string[];
}

export interface PayoutPage {
  number?: number;
  size?: number;
  payouts?: Payout[];
}

export interface CancelPayoutRequest {
  payoutId: string;
}
