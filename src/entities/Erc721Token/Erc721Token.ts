/* eslint-disable camelcase */
import { TokenInfo } from '@airswap/typescript';

export interface Erc721TokenAttribute {
  item?: string;
  trait_type?: string;
  value: string | number;
}

export interface Erc721Token extends Omit<TokenInfo, 'extensions'> {
  extensions: {
    metadata: {
      name: string;
      image: string;
      description: string;
      attributes?: Erc721TokenAttribute[];
    }
  }
}
