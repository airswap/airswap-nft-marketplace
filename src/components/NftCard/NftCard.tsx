import React from 'react';

import { format } from '@greypixel_/nicenumbers';
import { utils } from 'ethers';
import { NavLink, NavLinkProps } from 'react-router-dom';

import './NftCard.scss';

const { parseEther } = utils;

interface NftCardProps extends NavLinkProps {
  imageURI: string;
  name: string;
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
      {price && symbol ? <h4 className="nft-card__price">{`${format(parseEther(price))} ${symbol}`}</h4> : null}
    </div>
  </NavLink>
);

export default NftCard;
