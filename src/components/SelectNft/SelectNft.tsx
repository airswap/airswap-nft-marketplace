import React, { FC, useMemo } from 'react';

import { TokenInfo } from '@airswap/types';

import Dropdown from '../../compositions/Dropdown/Dropdown';
import { SelectOption } from '../../types/SelectOption';
import Icon from '../Icon/Icon';
import { getSelectNftOptions } from './helpers/getSelectNftOptions';

import './SelectNft.scss';

interface SelectNftProps {
  logoURI?: string;
  tokens: number[];
  title: string;
  token: TokenInfo;
  value: number;
  onSelect: (value: number) => void;
  className?: string;
}

const SelectNft: FC<SelectNftProps> = ({
  logoURI,
  tokens,
  title,
  token,
  value,
  onSelect,
  className = '',
}) => {
  const options = useMemo(() => getSelectNftOptions(tokens, token.name), [tokens, token]);
  const selectedOption = options.find(option => option.value === value?.toString()) || options[0] as SelectOption;

  const handleDropdownChange = (option: SelectOption): void => {
    onSelect(parseInt(option.value, 10));
  };

  return (
    <div className={`select-nft ${className}`}>
      <div className="select-nft__logo-icon" style={{ backgroundImage: `url("${logoURI}")` }} />
      <div className="select-nft__title-and-name">
        <h3 className="select-nft__title">{title}</h3>
        <h4 className="select-nft__name">{`${token.name} #${value}`}</h4>
      </div>
      <Icon name="chevron-down" className="select-nft__chevron-down-icon" />

      <Dropdown
        selectedOption={selectedOption}
        options={options}
        onChange={handleDropdownChange}
        className="select-nft__dropdown"
        buttonClassName="select-nft__dropdown-button"
        dropdownButtonClassName="select-nft__dropdown-dropdown-button"
        dropdownButtonBackgroundClassName="select-nft__dropdown-dropdown-button-background"
        mobileSelectIconClassName="select-nft__dropdown-mobile-select-icon"
      />
    </div>
  );
};

export default SelectNft;
