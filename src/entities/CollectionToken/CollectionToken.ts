import { Erc721Attribute } from '../Erc721Token/Erc721Token';
import { Erc1155Attribute } from '../Erc1155Token/Erc1155Token';

export interface CollectionToken {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  atributes?: Erc721Attribute[] | Erc1155Attribute[];
  createdBy?: string;
  externalUrl?: string;
}
