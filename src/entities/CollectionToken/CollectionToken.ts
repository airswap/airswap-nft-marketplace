export interface CollectionTokenAttribute {
  label: string;
  value: string | number;
}

export interface CollectionToken {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  attributes: CollectionTokenAttribute[];
  createdBy?: string;
  externalUrl?: string;
}
