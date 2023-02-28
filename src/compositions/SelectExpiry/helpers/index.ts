import { SelectOption } from '../../../types/SelectOption';

export const getExpiryOptionsTranslations = () => {
  const msPerMinute = 60000;

  const expiryOptions: SelectOption[] = [
    {
      label: 'minutes',
      value: `${msPerMinute}`,
    },
    {
      label: 'hours',
      value: `${60 * msPerMinute}`,
    },
    {
      label: 'days',
      value: `${24 * 60 * msPerMinute}`,
    },
    {
      label: 'weeks',
      value: `${7 * 24 * 60 * msPerMinute}`,
    },
  ];

  return expiryOptions;
};
