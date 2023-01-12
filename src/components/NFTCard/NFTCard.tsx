import React from 'react';

import './NFTCard.scss';

type NFTCardProps = {
  imageURI: string;
  name: string;
  price: number;
}

const NFTCard = ({ imageURI, name, price }: NFTCardProps) => (
  <div className="nft-card">
    <img className="nft-card__img" src={imageURI} alt={name} />
    <div className="nft-card__name">{name}</div>
    <div className="nft-card__price">{`${price} ETH`}</div>
  </div>
);

export default NFTCard;
