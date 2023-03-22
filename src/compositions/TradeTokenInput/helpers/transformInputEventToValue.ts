import { ChangeEvent } from 'react';

export const transformInputEventToValue = (e: ChangeEvent<HTMLInputElement>): string | undefined => {
  const floatRegExp = /^([0-9])*[.,]?([0-9])*$/;
  let { value } = e.currentTarget;

  if (value === '') {
    return '';
  }

  if (!floatRegExp.test(value)) {
    return undefined;
  }

  if (value[value.length - 1] === ',') {
    value = `${value.slice(0, value.length - 1)}.`;
  }

  value = value.replace(/^0+/, '0');

  return value;
};
