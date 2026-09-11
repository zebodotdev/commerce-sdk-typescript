import { describe, expect, it } from 'vitest';

import type { CountrySpecifications } from '../types';

describe('country specifications', () => {
  it('uses the string capability arrays returned by the API', () => {
    const specifications: CountrySpecifications = {
      gh: {
        countryCode: 'gh',
        legalEntityTypes: ['company'],
        financialAccountTypes: ['bank_account'],
        idDocumentTypes: ['passport'],
      },
    };

    expect(specifications.gh?.legalEntityTypes).toEqual(['company']);
    expect(specifications.gh?.financialAccountTypes).toEqual(['bank_account']);
    expect(specifications.gh?.idDocumentTypes).toEqual(['passport']);
  });
});
