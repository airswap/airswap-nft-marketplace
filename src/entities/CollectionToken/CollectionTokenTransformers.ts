import { Erc721Token } from '../Erc721Token/Erc721Token';
import { CollectionToken } from './CollectionToken';

export const transformErc721TokenToCollectionToken = (erc721Token: Erc721Token, tokenId: number, price: number): CollectionToken => ({
  id: tokenId,
  image: erc721Token.image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
  description: erc721Token.description,
  price,
  name: erc721Token.name,
});
