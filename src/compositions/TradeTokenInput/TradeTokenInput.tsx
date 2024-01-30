import React, { ChangeEvent, FC } from 'react';

import { TokenInfo } from '@airswap/utils';

import Input from '../../components/Input/Input';
import { transformInputEventToValue } from './helpers/transformInputEventToValue';

import './TradeTokenInput.scss';

interface TradeTokenInputProps {
  protocolFeeInCurrencyToken?: string;
  protocolFeePercent?: number;
  token: TokenInfo;
  value: string;
  onInputChange: (value: string) => void;
  className?: string;
}

const TradeTokenInput: FC<TradeTokenInputProps> = ({
  protocolFeeInCurrencyToken,
  protocolFeePercent,
  token,
  value,
  onInputChange,
  className = '',
}) => {
  const logoURI = 'logoURI' in token && token.logoURI;
  const image = 'image' in token && token.image;
  const symbol = 'symbol' in token && token.symbol;
  const name = 'name' in token && token.name;
  const id = 'id' in token && token.id;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newValue = transformInputEventToValue(e);

    if (newValue !== undefined) {
      onInputChange(newValue);
    }
  };

  return (
    <div className={`trade-token-input ${className}`}>
      <div className="trade-token-input__icon" style={{ backgroundImage: `url("${logoURI || image}")` }} />
      <div className="trade-token-input__title-and-name">
        <h3 className="trade-token-input__title">For</h3>
        <h4 className="trade-token-input__name">{symbol || `${name} #${id}`}</h4>
      </div>
      <div className="trade-token-input__amount-container">
        <div className="trade-token-input__amount-container-content">
          <Input
            inputMode="decimal"
            autoComplete="off"
            pattern="^[0-9]*[.,]?[0-9]*$"
            minLength={1}
            maxLength={79}
            spellCheck={false}
            value={value}
            onChange={handleInputChange}
            placeholder="0.00"
            className="trade-token-input__input"
          />
          <span className="trade-token-input__amount-subtext">
            {protocolFeePercent && `Exl. fee ${protocolFeePercent}%`}
            {protocolFeeInCurrencyToken && `= ${protocolFeeInCurrencyToken} ${token.symbol}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TradeTokenInput;
