import React, { FC, useMemo } from 'react';

import Input from '../../components/Input/Input';
import { ExpiryTimeUnit } from '../../types/ExpiryTimeUnit';
import { SelectOption } from '../../types/SelectOption';
import Dropdown from '../Dropdown/Dropdown';
import { getExpiryTimeUnitOptions, transformToExpiryTimeUnit } from './helpers';

import './SelectExpiry.scss';

interface SelectExpiryProps {
  amount?: number;
  timeUnit: ExpiryTimeUnit;
  onAmountChange: (amount?: number) => void;
  onTimeUnitChange: (timeUnit: ExpiryTimeUnit) => void;
  className?: string;
}

const SelectExpiry: FC<SelectExpiryProps> = ({
  amount,
  timeUnit,
  className = '',
  onAmountChange,
  onTimeUnitChange,
}) => {
  const expiryOptions = useMemo(() => getExpiryTimeUnitOptions(), []);

  const unitOption = useMemo(
    () => expiryOptions.find(option => option.value === timeUnit) as SelectOption,
    [expiryOptions, timeUnit],
  );

  const handleInputAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAmountChange(parseInt(e.target.value, 10) || undefined);
  };

  const handleDropdownExpiryOptionChange = (option: SelectOption) => {
    onTimeUnitChange(transformToExpiryTimeUnit(option.value));
  };

  return (
    <div className={`select-expiry ${className}`}>
      <div className="select-expiry__label">
        Expires in
      </div>
      <Input
        min="1"
        type="number"
        value={amount || ''}
        onChange={handleInputAmountChange}
        className="select-expiry__input-amount"
      />
      <Dropdown
        selectedOption={unitOption}
        options={expiryOptions}
        onChange={handleDropdownExpiryOptionChange}
        className="select-expiry__dropdown"
        buttonClassName="select-expiry__dropdown-button"
      />
    </div>
  );
};

export default SelectExpiry;
