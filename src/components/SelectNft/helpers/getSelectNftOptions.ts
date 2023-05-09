import { SelectOption } from '../../../types/SelectOption';

export const getSelectNftOptions = (tokens: number[], collectionName: string): SelectOption[] => tokens.map(token => ({
  value: token.toString(),
  label: `${collectionName} #${token}`,
}));
