import { tokenKinds } from '@airswap/constants';
import { TokenInfo } from '@airswap/typescript';

import { Erc721Token } from '../Erc721Token/Erc721Token';
import { Erc1155Token } from '../Erc1155Token/Erc1155Token';
import { CollectionToken } from './CollectionToken';

export const transformErc721TokenToCollectionToken = (token: Erc721Token, tokenId: number, price: number): CollectionToken => ({
  id: tokenId,
  image: token.image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
  description: token.description,
  price,
  atributes: token.attributes,
  name: token.name,
});

export const transformErc1155TokenToCollectionToken = (token: Erc1155Token, tokenId: number, price: number): CollectionToken => ({
  id: tokenId,
  image: token.image_url,
  description: token.description,
  price,
  name: token.name,
  atributes: token.attributes,
  createdBy: token.created_by,
  externalUrl: token.external_url,
});

export const transformNFTTokenToCollectionToken = (tokenInfo: TokenInfo, tokenId: number, price: number):CollectionToken | null => {
  switch (tokenInfo.extensions?.kind) {
    case tokenKinds.ERC721:
      return transformErc721TokenToCollectionToken(tokenInfo.extensions?.metadata as unknown as Erc721Token, tokenId, price);
    case tokenKinds.ERC1155:
      return transformErc1155TokenToCollectionToken(tokenInfo.extensions?.metadata as unknown as Erc1155Token, tokenId, price);
    default:
      return null;
  }
};
