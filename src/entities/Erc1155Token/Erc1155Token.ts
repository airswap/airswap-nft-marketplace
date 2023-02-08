/* eslint-disable camelcase */
export interface Erc1155Attribute {
  trait_type: string;
  value: number;
}

export interface Erc1155Token {
  name: string;
  image_url: string;
  description: string;
  attributes?: Erc1155Attribute[];
  created_by?: string;
  external_url?: string;
}
