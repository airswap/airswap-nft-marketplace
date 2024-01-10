export interface Address {
  address: string;
  ens?: string;
}

export interface EnsAddressesMap {
  [address: string]: string | null;
}
