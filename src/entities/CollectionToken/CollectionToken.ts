export interface CollectionTokenAttribute {
  label: string;
  value: string | number;
}

export interface CollectionToken {
  id: number;
  name: string;
  image: string;
  description: string;
  attributes: CollectionTokenAttribute[];
  price: string;
  symbol: string;
  createdBy?: string;
  externalUrl?: string;
}
