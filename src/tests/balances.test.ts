import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Balances } from '../resources/balances';
import { HttpClient } from '../http-client';
import { BalanceSnapshot } from '../types';

describe('Balances', () => {
  let balances: Balances;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient({ apiKey: 'test' });
    balances = new Balances(httpClient);
  });

  it('should fetch balances', async () => {
    const snapshot: BalanceSnapshot = {
      ghs: {
        available: { amount: 1000 },
        pending: { amount: 200 },
        reserved: { amount: 100 },
        refund: { amount: 50 },
        includesTransactionsBefore: '2024-01-01T00:00:00Z',
      },
    };
    const mockResponse = {
      balances: snapshot,
    };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);

    const result = await balances.get();

    expect(result).toEqual(snapshot);
    expect(postSpy).toHaveBeenCalledWith('/balances', {});
  });
});
