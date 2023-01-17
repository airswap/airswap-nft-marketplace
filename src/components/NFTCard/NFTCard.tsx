import React from 'react';

import './NFTCard.scss';

interface NFTCardProps {
  imageURI: string;
  name: string;
  price: number;
  className?: string;
}

const NFTCard = ({
  imageURI, name, price, className,
}: NFTCardProps) => (
  <div className={`nft-card ${className}`}>
    <img className="nft-card__img" src={imageURI} alt={name} />
    <div className="nft-card__name">{name}</div>
    <div className="nft-card__price">{`${price} ETH`}</div>
  </div>
);

export default NFTCard;
