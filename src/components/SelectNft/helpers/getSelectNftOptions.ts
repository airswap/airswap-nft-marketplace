import { CollectionToken } from '../../../entities/CollectionToken/CollectionToken';
import { SelectOption } from '../../../types/SelectOption';

export const getSelectNftOptions = (userNfts: CollectionToken[], name: string): SelectOption[] => userNfts.map(nft => ({
  value: nft.id.toString(),
  label: `${name} #${nft.id}`,
}));
