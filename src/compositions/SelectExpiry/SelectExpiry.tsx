import React, { FC, useMemo, useState } from 'react';

import Input from '../../components/Input/Input';
import Dropdown from '../Dropdown/Dropdown';
import { getExpiryOptionsTranslations } from './helpers';

import './SelectExpiry.scss';

interface SelectExpiryProps {
  className?: string;
}

const SelectExpiry: FC<SelectExpiryProps> = ({ className = '' }) => {
  const expiryOptions = useMemo(() => getExpiryOptionsTranslations(), []);
  const [unit, setUnit] = useState(expiryOptions[1]);
  const [amount, setAmount] = useState(60);

  const handleInputAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setAmount(value);
  };

  return (
    <div className={`select-expiry ${className}`}>
      <div className="select-expiry__label">
        Expires in
      </div>
      <Input
        type="number"
        value={amount}
        onChange={handleInputAmountChange}
        className="select-expiry__input-amount"
      />
      <Dropdown
        selectedOption={unit}
        options={expiryOptions}
        onChange={setUnit}
        className="select-expiry__dropdown"
        buttonClassName="select-expiry__dropdown-button"
      />
    </div>
  );
};

export default SelectExpiry;
