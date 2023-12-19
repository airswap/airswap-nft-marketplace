import React from 'react';

import classNames from 'classnames';
import { NavLink, NavLinkProps } from 'react-router-dom';

import './NftCard.scss';

interface NftCardProps extends NavLinkProps {
  isHighlighted?: boolean;
  balance?: string;
  expiry?: Date;
  imageURI?: string;
  label?: string;
  name?: string;
  price?: string;
  symbol?: string;
  className?: string;
}

const NftCard = ({
  isHighlighted,
  balance,
  expiry,
  imageURI,
  label,
  name,
  price,
  symbol,
  to,
  className = '',
}: NftCardProps) => {
  const linkClassName = classNames('nft-card', {
    'nft-card--is-highlighted': isHighlighted,
  }, className);

  const namePlusBalance = balance ? `${name} (${balance})` : name;

  return (
    <NavLink to={to} className={linkClassName}>
      <img className="nft-card__img" src={imageURI} alt={name} />
      {label && <div className="nft-card__label">{label}</div>}
      <div className="nft-card__info-wrapper">
        <h3 className="nft-card__name">{namePlusBalance}</h3>
        <h4 className="nft-card__price">
          {(price && symbol) ? `${price} ${symbol}` : <>&nbsp;</>}
        </h4>
        {expiry && (
          <h5 className="nft-card__expiry">{`Sale ends ${expiry.toLocaleString()}`}</h5>
        )}
      </div>
    </NavLink>
  );
};

export default NftCard;
