export interface Address {
  isLoading: boolean;
  address: string;
  ens?: string;
}

export interface EnsAddresses {
  [address: string]: string | null;
}
