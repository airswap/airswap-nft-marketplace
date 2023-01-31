import React from 'react';

import { format } from '@greypixel_/nicenumbers';
import { BigNumber } from 'ethers';
import { NavLink, NavLinkProps } from 'react-router-dom';

import './NftCard.scss';

interface NftCardProps extends NavLinkProps {
  imageURI: string;
  name: string;
  price: string;
  className?: string;
}

const NftCard = ({
  imageURI,
  name,
  price,
  to,
  className = '',
}: NftCardProps) => (
  <NavLink to={to} className={`nft-card ${className}`}>
    <img className="nft-card__img" src={imageURI} alt={name} />
    <div className="nft-card__info-wrapper">
      <h3 className="nft-card__name">{name}</h3>
      <h4 className="nft-card__price">{`${format(BigNumber.from(price))} ${process.env.REACT_APP_PAYMENT_TOKEN}`}</h4>
    </div>
  </NavLink>
);

export default NftCard;
