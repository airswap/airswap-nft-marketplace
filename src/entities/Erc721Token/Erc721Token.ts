export interface Attribute {
  item: string;
  value: number;
}

export interface Erc721Token {
  name: string;
  image: string;
  description: string;
  attributes: Attribute[];
}
