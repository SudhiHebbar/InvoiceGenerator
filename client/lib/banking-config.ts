interface BankingConfig {
  beneficiaryAccountNumber: string;
  beneficiaryName: string;
  beneficiaryBankName: string;
  ifscCode: string;
  beneficiaryBankAddress: string;
}

let cachedConfig: BankingConfig | null = null;

export const loadBankingConfig = async (): Promise<BankingConfig> => {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    // Try to load from banking-config.json first
    const response = await fetch('/banking-config.json');
    if (response.ok) {
      const config = await response.json();
      cachedConfig = config.defaultBankingInfo;
      return cachedConfig;
    }
  } catch (error) {
    console.warn('Banking config file not found, using empty defaults');
  }

  // Fallback to empty config
  const emptyConfig: BankingConfig = {
    beneficiaryAccountNumber: '',
    beneficiaryName: '',
    beneficiaryBankName: '',
    ifscCode: '',
    beneficiaryBankAddress: '',
  };

  cachedConfig = emptyConfig;
  return cachedConfig;
};

export const getDefaultBankingInfo = (): BankingConfig => {
  return cachedConfig || {
    beneficiaryAccountNumber: '',
    beneficiaryName: '',
    beneficiaryBankName: '',
    ifscCode: '',
    beneficiaryBankAddress: '',
  };
};
