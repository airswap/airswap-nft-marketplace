import React, { FC, useMemo } from 'react';

import { CollectionTokenInfo } from '@airswap/types';

import Dropdown from '../../compositions/Dropdown/Dropdown';
import { SelectOption } from '../../types/SelectOption';
import Icon from '../Icon/Icon';
import { getSelectNftOptions } from './helpers/getSelectNftOptions';

import './SelectNft.scss';

interface SelectNftProps {
  collectionName: string;
  logoURI?: string;
  tokens: string[];
  title: string;
  token?: CollectionTokenInfo;
  value: string;
  onSelect: (value: string) => void;
  className?: string;
}

const SelectNft: FC<SelectNftProps> = ({
  collectionName,
  logoURI,
  tokens,
  title,
  token,
  value,
  onSelect,
  className = '',
}) => {
  const options = useMemo(() => getSelectNftOptions(tokens, collectionName), [tokens, collectionName, token]);
  const selectedOption = options.find(option => option.value === value?.toString()) || options[0] as SelectOption;

  const handleDropdownChange = (option: SelectOption): void => {
    onSelect(option.value);
  };

  return (
    <div className={`select-nft ${className}`}>
      <div className="select-nft__logo-icon" style={{ backgroundImage: `url("${logoURI}")` }} />
      <div className="select-nft__title-and-name">
        <h3 className="select-nft__title">{title}</h3>
        <h4 className="select-nft__name">{`${collectionName} ${token?.id ? `#${token.id}` : ''}`}</h4>
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
