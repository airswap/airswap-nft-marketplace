import { ExpiryTimeUnit } from '../../../types/ExpiryTimeUnit';
import { SelectOption } from '../../../types/SelectOption';

export const getExpiryTimeUnitOptions = (): SelectOption[] => [
  {
    label: 'minutes',
    value: ExpiryTimeUnit.minutes,
  },
  {
    label: 'hours',
    value: ExpiryTimeUnit.hours,
  },
  {
    label: 'days',
    value: ExpiryTimeUnit.days,
  },
  {
    label: 'weeks',
    value: ExpiryTimeUnit.weeks,
  },
];

export const transformToExpiryTimeUnit = (value: string): ExpiryTimeUnit => {
  if (value === ExpiryTimeUnit.minutes) {
    return ExpiryTimeUnit.minutes;
  }

  if (value === ExpiryTimeUnit.hours) {
    return ExpiryTimeUnit.hours;
  }

  if (value === ExpiryTimeUnit.days) {
    return ExpiryTimeUnit.days;
  }

  return ExpiryTimeUnit.weeks;
};

// const msPerMinute = 60000;
//
// value: `${msPerMinute}`,
// {
//   label: 'hours',
//     value: `${60 * msPerMinute}`,
// },
// {
//   label: 'days',
//     value: `${24 * 60 * msPerMinute}`,
// },
// {
//   label: 'weeks',
//     value: `${7 * 24 * 60 * msPerMinute}`,
