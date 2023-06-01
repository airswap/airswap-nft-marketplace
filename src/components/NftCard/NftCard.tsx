import React from 'react';

import { NavLink, NavLinkProps } from 'react-router-dom';

import './NftCard.scss';

interface NftCardProps extends NavLinkProps {
  imageURI?: string;
  name?: string;
  price?: string;
  symbol?: string;
  className?: string;
}

const NftCard = ({
  imageURI,
  name,
  price,
  symbol,
  to,
  className = '',
}: NftCardProps) => (
  <NavLink to={to} className={`nft-card ${className}`}>
    <img className="nft-card__img" src={imageURI} alt={name} />
    <div className="nft-card__info-wrapper">
      <h3 className="nft-card__name">{name}</h3>
      <h4 className="nft-card__price">
        {(price && symbol) ? `${price} ${symbol}` : <>&nbsp;</>}
      </h4>
    </div>
  </NavLink>
);

export default NftCard;
