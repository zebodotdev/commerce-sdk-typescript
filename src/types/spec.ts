export interface FinancialAccountTypeSpec {
  name?: string;
  label?: string;
  description?: string;
  subtypes?: string[];
}

export interface LegalEntityTypeSpec {
  type?: string;
  name?: string;
  description?: string;
}

export interface IDDocumentTypeSpec {
  name?: string;
  label?: string;
  description?: string;
}

export interface BankBranchSpec {
  id?: string;
  name?: string;
  sortCode?: string;
}

export interface BankSpec {
  id?: string;
  name?: string;
  swiftCode?: string;
  sortCodePrefix?: string;
  branches?: BankBranchSpec[];
}

export interface CountryBankSpec {
  bankAccountType?: string;
  codeScheme?: string;
  items?: BankSpec[];
}

export interface CountrySpecification {
  countryCode?: string;
  countryName?: string;
  currencies?: string[];
  paymentMethods?: string[];
  payoutSchedules?: string[];
  btAgingSpecs?: string[];
  legalEntityTypes?: string[];
  financialAccountTypes?: string[];
  idDocumentTypes?: string[];
  banks?: CountryBankSpec;
}

export type CountrySpecifications = Readonly<Record<string, CountrySpecification>>;
