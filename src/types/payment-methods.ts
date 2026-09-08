import type { RequestMeta } from './requests';
import type { CustomData, CustomDataPatch } from './custom-data';

export const PaymentMethodTypes = {
  MobileMoney: 'mobile_money',
  BankAccount: 'bank_account',
  Card: 'card',
  Motito: 'motito',
} as const;
export type PaymentMethodType = (typeof PaymentMethodTypes)[keyof typeof PaymentMethodTypes];

export const MobileMoneyNetworks = {
  Airtel: 'airtel',
  MTN: 'mtn',
  Telecel: 'telecel',
  Vodafone: 'vodafone',
} as const;
export type MobileMoneyNetwork = (typeof MobileMoneyNetworks)[keyof typeof MobileMoneyNetworks];
/** @deprecated Prefer `MobileMoneyNetwork`. */
export type MobileMoneyIssuer = MobileMoneyNetwork;

export interface MobileMoneyDetails {
  accountNumber: string;
  network: MobileMoneyNetwork;
}

export interface PaymentMethodMobileMoney {
  accountNumber?: string;
  network?: MobileMoneyNetwork;
}

export interface PaymentMethodBankAccount {
  type?: string;
  ghanaBankAccount?: {
    branch?: string;
    name?: string;
    accountNumber?: string;
    sortCode?: string;
    swiftCode?: string;
  } | null;
}

export interface PaymentMethodCard {
  brand?: string;
  expiresOn?: string;
  issuer?: {
    emailAddress?: string;
    name?: string;
    phoneNumber?: string;
    type?: string;
  };
  owner?: {
    emailAddress?: string;
    name?: string;
    phoneNumber?: string;
  };
  type?: string;
}

export interface PaymentMethodVerification {
  completedAt?: string | null;
  initiatedAt?: string;
  mechanism?: string;
  requestId?: string;
  type?: string;
}

export interface PaymentMethodData {
  type: 'mobile_money';
  mobileMoney: MobileMoneyDetails;
}

export interface PaymentMethodOwnerAddress {
  city?: string | null;
  country?: string;
  line1?: string | null;
  line2?: string | null;
  name?: string | null;
  phoneNumber?: string | null;
  postCode?: string | null;
  region?: string | null;
}

export interface PaymentMethodOwner {
  name?: string;
  address?: PaymentMethodOwnerAddress | null;
}

export interface PaymentMethod {
  id: string;
  active?: boolean;
  archivedAt?: string | null;
  customerId: string;
  type: PaymentMethodType;
  mobileMoney?: PaymentMethodMobileMoney | null;
  bankAccount?: PaymentMethodBankAccount | null;
  card?: PaymentMethodCard | null;
  owner?: PaymentMethodOwner | null;
  verification?: PaymentMethodVerification | null;
  customData?: CustomData;
  expiresOn?: string | null;
  createdAt: string;
  verified: boolean;
  verifiedAt?: string | null;
}

export interface TokenizePaymentMethodRequest {
  /** Request metadata such as idempotency controls */
  requestMeta?: RequestMeta;
  customerId: string;
  type: 'mobile_money';
  mobileMoney: MobileMoneyDetails;
  owner: PaymentMethodOwner;
  customData?: CustomData;
}

export interface VerifyPaymentMethodRequest {
  /** Request metadata such as idempotency controls */
  requestMeta?: RequestMeta;
  paymentMethodId: string;
}

export type VerificationStatus = 'pending' | 'verified' | 'failed' | string;

export interface PaymentMethodVerificationSession {
  paymentMethodId?: string;
  status?: VerificationStatus;
  tokenSentAt?: string;
  expiresAt?: string;
  delivery?: {
    recipient?: string;
    channel?: 'sms' | 'email' | string;
    senderId?: string;
  };
}

export interface ConfirmPaymentMethodVerificationRequest {
  paymentMethodId: string;
  token: string;
}

export interface LookupPaymentMethodRequest {
  paymentMethodId: string;
}

export interface PagePaymentMethodsRequest {
  customerId?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface PaymentMethodPage {
  number?: number;
  size?: number;
  paymentMethods?: PaymentMethod[];
}

export interface UpdatePaymentMethodRequest {
  paymentMethodId: string;
  customData?: CustomDataPatch;
  active?: boolean;
  archived?: boolean;
  owner?: PaymentMethodOwner;
}

export interface PaymentMethodActionRequest {
  paymentMethodId: string;
}

export interface DeletePaymentMethodRequest {
  /** Request metadata such as idempotency controls */
  requestMeta?: RequestMeta;
  paymentMethodId: string;
}

export interface PaymentMethodDeletion {
  deleted?: boolean;
  paymentMethodId?: string;
}

export interface PaymentMethodTypeSetting {
  type?: PaymentMethodType;
  name?: string;
  description?: string;
  enabled?: boolean;
  confirmsUse?: boolean;
}

export interface PaymentMethodSettings {
  mobileMoney?: PaymentMethodTypeSetting;
  bankAccount?: PaymentMethodTypeSetting;
  card?: PaymentMethodTypeSetting;
  motito?: PaymentMethodTypeSetting;
}
