import React, { FC } from 'react';

import { CollectionTokenInfo } from '@airswap/utils';

import Button from '../../components/Button/Button';
import Icon from '../../components/Icon/Icon';

import './SelectNftButton.scss';

interface SelectNftProps {
  collectionName: string;
  logoURI?: string;
  title: string;
  token?: CollectionTokenInfo;
  onClick: () => void;
  className?: string;
}

const SelectNftButton: FC<SelectNftProps> = ({
  collectionName,
  logoURI,
  title,
  token,
  onClick,
  className = '',
}) => {
  const name = token?.name || `${collectionName} ${token?.id ? `#${token.id}` : ''}`;

  return (
    <Button onClick={onClick} className={`select-nft-button ${className}`}>
      <div className="select-nft-button__logo-icon" style={{ backgroundImage: `url("${logoURI}")` }} />
      <div className="select-nft-button__title-and-name">
        <h3 className="select-nft-button__title">{title}</h3>
        <h4 className="select-nft-button__name">{name}</h4>
      </div>
      <Icon name="chevron-down" className="select-nft-button__chevron-down-icon" />
    </Button>
  );
};

export default SelectNftButton;
