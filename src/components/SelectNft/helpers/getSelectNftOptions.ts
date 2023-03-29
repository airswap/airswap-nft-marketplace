import { SelectOption } from '../../../types/SelectOption';

export const getSelectNftOptions = (userNfts: number[], name: string): SelectOption[] => userNfts.map(nft => ({
  value: nft.toString(),
  label: `${name} #${nft}`,
}));
