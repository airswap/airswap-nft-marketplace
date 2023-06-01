import { CollectionTokenInfo } from '@airswap/types';

const filterNftBySearchValue = (value: string, nft: CollectionTokenInfo): boolean => {
  if (value === '') return true;

  if (nft.name && nft.name.toLowerCase().includes(value.toLowerCase())) return true;

  return nft.id.toString().toLowerCase().includes(value.toLowerCase());
};

export default filterNftBySearchValue;
