import type { Amount, AmountParams } from './money';
import type { Product } from './products';

/** An inline price supplied in a request. */
export interface PriceParams extends AmountParams {}

/** An inline price returned by the API. */
export interface Price extends Amount {}

/** Parameters for creating a stored catalog price. */
export interface CatalogPriceParams {
  productId?: string;
  label?: string;
  about?: string;
  amount: AmountParams;
}

export interface LookupPriceRequest {
  priceId: string;
}

export interface UpdatePriceRequest {
  priceId: string;
  productId?: string;
  label?: string;
  about?: string;
}

export interface PriceActionRequest {
  priceId: string;
}

export interface PagePricesRequest {
  pageNumber?: number;
  pageSize?: number;
  productId?: string;
}

export interface CatalogPrice {
  id: string;
  label?: string | null;
  about?: string | null;
  active: boolean;
  nominal: Amount;
  productId?: string;
  product?: Product | null;
  createdAt: Date;
  updatedAt?: Date | null;
  archivedAt?: Date | null;
}

export interface PricePage {
  number?: number;
  size?: number;
  prices?: CatalogPrice[];
}
