export interface BalanceAmount {
  readonly amount: number;
}

export interface BalanceBreakdown {
  readonly available: BalanceAmount;
  readonly pending: BalanceAmount;
  readonly reserved: BalanceAmount;
  readonly refund: BalanceAmount;
  readonly includesTransactionsBefore: Date;
}

export interface BalanceSnapshot {
  readonly ghs: BalanceBreakdown;
}
