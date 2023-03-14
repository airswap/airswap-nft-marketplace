/* eslint-disable camelcase */
// Camelcase is not forced here because data comes from external token metadata
import { TokenKinds } from '@airswap/constants';
import { TokenInfo } from '@airswap/types';

export interface Erc1155TokenAttribute {
  trait_type: string;
  value: number;
}

interface ImageDetails {
  bytes: number;
  format: string;
  sha256: string;
  width: number;
  height: number;
}

interface AnimationDetails {
  bytes: number;
  codecs: string[];
  duration: number;
  format: string;
  sha256: string;
  width: number;
  height: number;
}

// This seems to be the standard, if there's more standards then we need to add an entity for each one.
export interface Erc1155Token extends Omit<TokenInfo, 'extensions'> {
  extensions: {
    id: string;
    kind: TokenKinds.ERC1155;
    metadata: {
      animation?: string;
      animation_details?: AnimationDetails;
      attributes?: Erc1155TokenAttribute[]
      created_by?: string;
      description: string;
      external_url?: string;
      image: string;
      image_details?: ImageDetails;
      image_url?: string;
      name: string;
    }
  }
}
