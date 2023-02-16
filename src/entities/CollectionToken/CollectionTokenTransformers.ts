import { tokenKinds } from '@airswap/constants';
import { TokenInfo } from '@airswap/typescript';

import { Erc721Token, Erc721TokenAttribute } from '../Erc721Token/Erc721Token';
import { Erc1155Token, Erc1155TokenAttribute } from '../Erc1155Token/Erc1155Token';
import { CollectionToken, CollectionTokenAttribute } from './CollectionToken';

const transformErc721TokenAttributeToCollectionTokenAttribute = (attribute: Erc721TokenAttribute): CollectionTokenAttribute => ({
  label: attribute.item || attribute.trait_type || '',
  value: `${attribute.value}`,
});

export const transformErc721TokenToCollectionToken = (token: Erc721Token, tokenId: number, price: number): CollectionToken => ({
  id: tokenId,
  image: token.extensions.metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
  description: token.extensions.metadata.description,
  price,
  attributes: (token.extensions.metadata.attributes || []).map(transformErc721TokenAttributeToCollectionTokenAttribute),
  name: token.name,
});

const transformErc1155TokenAttributeToCollectionTokenAttribute = (attribute: Erc1155TokenAttribute): CollectionTokenAttribute => ({
  label: attribute.trait_type,
  value: `${attribute.value}`,
});

export const transformErc1155TokenToCollectionToken = (token: Erc1155Token, tokenId: number, price: number): CollectionToken => ({
  id: tokenId,
  image: (token.extensions.metadata.image_url || token.extensions.metadata.image).replace('ipfs://', 'https://ipfs.io/ipfs/'),
  description: token.extensions.metadata.description,
  price,
  name: token.extensions.metadata.name,
  attributes: (token.extensions.metadata.attributes || []).map(transformErc1155TokenAttributeToCollectionTokenAttribute),
  createdBy: token.extensions.metadata.created_by,
  externalUrl: token.extensions.metadata.external_url,
});

export const transformNFTTokenToCollectionToken = (tokenInfo: TokenInfo, tokenId: number, price: string): CollectionToken | undefined => {
  switch (tokenInfo.extensions?.kind) {
    case tokenKinds.ERC721:
      return transformErc721TokenToCollectionToken(tokenInfo as unknown as Erc721Token, tokenId, parseInt(price, 10));
    case tokenKinds.ERC1155:
      return transformErc1155TokenToCollectionToken(tokenInfo as unknown as Erc1155Token, tokenId, parseInt(price, 10));
    default:
      return undefined;
  }
};
