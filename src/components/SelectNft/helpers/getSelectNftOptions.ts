import { SelectOption } from '../../../types/SelectOption';

export const getSelectNftOptions = (tokens: number[]): SelectOption[] => tokens.map(token => ({
  value: token.toString(),
  label: `#${token}`,
}));
