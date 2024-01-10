import { Address, EnsAddressesMap } from './Address';

export const transformToAddress = (
  address: string,
  ensAddress: string | null = null,
): Address => ({
  address,
  ...(ensAddress && { ens: ensAddress }),
});

export const transformAddressesToEnsAddressesMap = (addresses: Address[]): EnsAddressesMap => {
  const ensAddresses: EnsAddressesMap = {};

  addresses.forEach((address) => {
    ensAddresses[address.address] = address.ens || null;
  });

  return ensAddresses;
};
