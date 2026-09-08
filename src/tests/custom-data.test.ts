import { describe, expect, it } from 'vitest';
import {
  CustomDataBuilder,
  CustomDataPatchBuilder,
  MAX_CUSTOM_DATA_BYTES,
  createCustomData,
} from '../types/custom-data';

describe('semantic custom data', () => {
  it('returns an immutable detached value', () => {
    const source = { campaign: 'launch' };
    const data = createCustomData(source);
    source.campaign = 'changed';

    expect(data.campaign).toBe('launch');
    expect(Object.isFrozen(data)).toBe(true);
  });

  it('supports controlled mutation and explicit patch removal', () => {
    const data = new CustomDataBuilder().set('segment', 'vip').build();
    const patch = new CustomDataPatchBuilder().set('segment', 'returning').unset('old').build();

    expect(data).toEqual({ segment: 'vip' });
    expect(patch).toEqual({ segment: 'returning', old: null });
  });

  it('enforces encoded size limits before a request is sent', () => {
    expect(() => createCustomData({ oversized: 'x'.repeat(MAX_CUSTOM_DATA_BYTES) })).toThrow(
      RangeError
    );
  });
});
