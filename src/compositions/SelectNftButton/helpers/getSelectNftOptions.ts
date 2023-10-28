import { SelectOption } from '../../../types/SelectOption';

export const getSelectNftOptions = (tokens: string[], collectionName: string): SelectOption[] => tokens.map(token => ({
  value: token.toString(),
  label: `${collectionName} #${token}`,
}));
