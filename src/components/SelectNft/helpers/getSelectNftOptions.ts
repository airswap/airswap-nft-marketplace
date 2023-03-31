import { SelectOption } from '../../../types/SelectOption';

export const getSelectNftOptions = (tokens: number[], name: string): SelectOption[] => tokens.map(token => ({
  value: token.toString(),
  label: `${name} #${token}`,
}));
