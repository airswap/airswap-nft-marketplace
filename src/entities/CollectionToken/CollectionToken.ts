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
  symbol: string;
  createdBy?: string;
  externalUrl?: string;
}
