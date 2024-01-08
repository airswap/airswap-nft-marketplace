export interface Address {
  isLoading: boolean;
  address: string;
  ens?: string;
}

export interface EnsAddressesMap {
  [address: string]: string | null;
}
