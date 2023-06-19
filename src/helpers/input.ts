import { BigNumber } from 'bignumber.js';

// This helper function is used to round the number string to the nearest possible decimal allowed.
// To prevent the NUMERIC_FAULT error from bignumber.js when creating orders or approving spend amounts.

const toMaxAllowedDecimalsNumberString = (
  value: string,
  decimals = 18,
): string => {
  const lastCharacter = value[value.length - 1];

  if (
    value === ''
    || lastCharacter === '.'
    || lastCharacter === '0'
    || new BigNumber(value).toNumber() === 0
  ) {
    return value;
  }

  const bigNumber = new BigNumber(value).multipliedBy(10 ** decimals);

  const [numberStringWithoutDecimals] = bigNumber.toString().split('.');

  const number = new BigNumber(numberStringWithoutDecimals)
    .dividedBy(10 ** decimals)
    .toString();

  if (new BigNumber(number).toNumber() === 0) {
    const minimalAllowedValue = new BigNumber(1)
      .dividedBy(10 ** decimals)
      .toString();

    return minimalAllowedValue;
  }

  return number;
};

export default toMaxAllowedDecimalsNumberString;
