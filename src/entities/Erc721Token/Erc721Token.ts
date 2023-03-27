/* eslint-disable camelcase */
// Camel case is not forced here because data comes from external token metadata

import { TokenInfo } from '@airswap/types';

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
