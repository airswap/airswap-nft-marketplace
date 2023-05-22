import { CollectionTokenInfo } from '@airswap/types';

/**
 * Filter NFT by search value.
 * @param sValue The search value.
 * @param nft The NFT to filter.
 * @returns true if the NFT should be kept, false otherwise.
 */
const filterNftBySearchValue = (sValue: string, nft: CollectionTokenInfo) => {
  // If the search query is empty keep the nft.
  if (sValue === '') return true;
  // We can search by id, name, description & attribute values.
  if (nft.name && nft.name.toLowerCase().includes(sValue.toLowerCase())) return true;
  if (nft.description && nft.description.toLowerCase().includes(sValue.toLowerCase())) return true;
  if (nft.id.toString().toLowerCase().includes(sValue.toLowerCase())) return true;
  if (nft.attributes) {
    for (let j = 0; j < nft.attributes.length; j += 1) {
      const attribute = nft.attributes[j];
      if (attribute.value.toString().toLowerCase().includes(sValue.toLowerCase())) return true;
    }
  }
  return false;
};

export default filterNftBySearchValue;
