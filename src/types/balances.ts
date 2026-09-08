export interface BalanceAmount {
  amount?: number;
}

export interface BalanceBreakdown {
  available?: BalanceAmount;
  pending?: BalanceAmount;
  reserved?: BalanceAmount;
  refund?: BalanceAmount;
  includesTransactionsBefore?: string;
}

export type BalanceSnapshot = Readonly<Record<string, BalanceBreakdown>>;
