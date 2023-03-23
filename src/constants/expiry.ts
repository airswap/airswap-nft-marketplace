import { ExpiryTimeUnit } from '../types/ExpiryTimeUnit';

const msPerMinute = 60000;

export const expiryAmounts: Record<ExpiryTimeUnit, number> = {
  [ExpiryTimeUnit.minutes]: msPerMinute,
  [ExpiryTimeUnit.hours]: 60 * msPerMinute,
  [ExpiryTimeUnit.days]: 24 * 60 * msPerMinute,
  [ExpiryTimeUnit.weeks]: 7 * 24 * 60 * msPerMinute,
};
