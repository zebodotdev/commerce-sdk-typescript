import type { Amount } from './money';
import type { PriceParams } from './prices';
import type { Product } from './products';

export const PurchaseIntentStatuses = {
  Active: 'active',
  Expired: 'expired',
  Inactive: 'inactive',
  Used: 'used',
} as const;
export type PurchaseIntentStatus =
  (typeof PurchaseIntentStatuses)[keyof typeof PurchaseIntentStatuses];

export const PurchaseIntentActivityTypes = {
  ExpiredViewed: 'expired_viewed',
  OrderCreated: 'order_created',
  PaymentFailed: 'payment_failed',
  PaymentStarted: 'payment_started',
  Viewed: 'viewed',
} as const;
export type PurchaseIntentActivityType =
  (typeof PurchaseIntentActivityTypes)[keyof typeof PurchaseIntentActivityTypes];

export interface PurchaseIntentProductSelector {
  id: string;
  variantSetId?: string;
}

export interface PurchaseIntentPriceSelector {
  id?: string;
  nominal?: PriceParams;
  original?: {
    id?: string;
    nominal?: PriceParams;
  };
  originalId?: string;
}

export interface PurchaseIntentOriginalPrice {
  active: boolean;
  id?: string;
  label?: string;
  nominal: Amount;
}

export interface PurchaseIntentPrice {
  active: boolean;
  id?: string;
  label?: string;
  nominal: Amount;
  original?: PurchaseIntentOriginalPrice;
}

export interface PurchaseIntentQuantity {
  min: number;
  max?: number;
}

export interface PurchaseIntentUsage {
  singleUse?: boolean;
  multiUse?: boolean;
}

interface CreatePurchaseIntentBase {
  quantity: PurchaseIntentQuantity;
  usage?: PurchaseIntentUsage;
  expiresAt?: string;
}

type PurchaseIntentProductSelection =
  | {
      product: PurchaseIntentProductSelector;
      productId?: never;
    }
  | {
      productId: string;
      product?: never;
    };

type PurchaseIntentPriceSelection =
  | {
      price: PurchaseIntentPriceSelector;
      priceId?: never;
    }
  | {
      priceId: string;
      price?: never;
    };

export type CreatePurchaseIntentRequest = CreatePurchaseIntentBase &
  PurchaseIntentProductSelection &
  PurchaseIntentPriceSelection;

export interface UpdatePurchaseIntentRequest {
  id: string;
  quantity?: PurchaseIntentQuantity;
  expiresAt?: string | null;
  reactivate?: boolean;
}

export interface CancelPurchaseIntentRequest {
  id: string;
}

export interface LookupPurchaseIntentRequest {
  id: string;
}

export interface PagePurchaseIntentsRequest {
  pageNumber: number;
  pageSize: number;
}

export interface PurchaseIntentActivityAttribution {
  landingUrl?: string;
  referrer?: string;
  referrerHost?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  channel?: string;
}

export interface PurchaseIntentActivityVisitor {
  sessionId?: string;
  visitorId?: string;
  userAgent?: string;
  device?: string;
  browser?: string;
  os?: string;
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
}

export interface PurchaseIntentActivity {
  id?: string;
  purchaseIntentId?: string;
  type?: PurchaseIntentActivityType;
  source?: string;
  attribution?: PurchaseIntentActivityAttribution;
  visitor?: PurchaseIntentActivityVisitor;
  productId?: string;
  variantProductId?: string;
  quantity?: number;
  amount?: Amount;
  orderId?: string;
  paymentId?: string;
  errorCode?: string;
  createdAt?: string;
}

export interface PurchaseIntentActivityLog {
  recent?: PurchaseIntentActivity[];
}

export interface PurchaseIntent {
  id: string;
  productId: string;
  priceId: string;
  quantity: PurchaseIntentQuantity;
  adjustableQuantity: boolean;
  allowVariants: boolean;
  status: PurchaseIntentStatus;
  createdAt: string;
  updatedAt?: string | null;
  activity?: PurchaseIntentActivityLog;
  product?: Product;
  price?: PurchaseIntentPrice;
}

export interface PurchaseIntentPage {
  number?: number;
  size?: number;
  purchaseIntents?: PurchaseIntent[];
}
