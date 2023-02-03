import { tokenKinds } from '@airswap/constants';
import { TokenInfo } from '@airswap/typescript';

import { CollectionToken } from './CollectionToken';

export const transformErc721TokenToCollectionToken = (tokenInfo: TokenInfo, tokenId: number, price: number): CollectionToken => ({
  id: tokenId,
  image: (tokenInfo.extensions?.metadata as any).image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
  description: (tokenInfo.extensions?.metadata as any).description,
  price,
  name: (tokenInfo.extensions?.metadata as any).name,
});

export const transformErc1155TokenToCollectionToken = (tokenInfo: TokenInfo, tokenId: number, price: number): CollectionToken => ({
  id: tokenId,
  image: (tokenInfo.extensions?.metadata as any).image_url,
  description: (tokenInfo.extensions?.metadata as any).description,
  price,
  name: (tokenInfo.extensions?.metadata as any).name,
});

export const transformNFTTokenToCollectionToken = (tokenInfo: TokenInfo, tokenId: number, price: number):CollectionToken | null => {
  switch (tokenInfo.extensions?.kind) {
    case tokenKinds.ERC721:
      return transformErc721TokenToCollectionToken(tokenInfo, tokenId, price);
    case tokenKinds.ERC1155:
      return transformErc1155TokenToCollectionToken(tokenInfo, tokenId, price);
    default:
      return null;
  }
};
