import SUPPORTED_WALLET_PROVIDERS, { WalletProvider } from '../../../constants/supportedWalletProviders';

const LAST_PROVIDER_LOCAL_STORAGE_KEY = 'airswap/lastConnectedProvider';

export const saveLastProviderToLocalStorage = (walletName: string) => {
  localStorage.setItem(LAST_PROVIDER_LOCAL_STORAGE_KEY, walletName);
};

export const clearLastProvider = () => {
  localStorage.setItem(LAST_PROVIDER_LOCAL_STORAGE_KEY, '');
};

export const getLastProviderFromLocalStorage = (): WalletProvider | undefined => {
  const providerName = localStorage.getItem(LAST_PROVIDER_LOCAL_STORAGE_KEY);

  if (!providerName) {
    return undefined;
  }

  const provider = SUPPORTED_WALLET_PROVIDERS.find(
    (p) => p.name === providerName,
  );

  if (!provider) {
    console.error(`Could not find provider from localStorage: ${providerName}`);

    return undefined;
  }

  return provider;
};

