import React, { useRef } from 'react';

import { useEventListener } from 'usehooks-ts';

import './NFTCard.scss';

interface NFTCardProps {
  imageURI: string;
  name: string;
  price: number;
  onClick?: (e: MouseEvent) => void;
  className?: string;
}

const NFTCard = ({
  imageURI, name, price, className, onClick,
}: NFTCardProps) => {
  const containerRef = useRef(null);
  const click = (e: MouseEvent) => {
    if (onClick) {
      onClick(e);
    }
  };
  useEventListener('click', click, containerRef);

  return (
    <div className={`nft-card ${className}`} ref={containerRef}>
      <img className="nft-card__img" src={imageURI} alt={name} />
      <div className="nft-card__name">{name}</div>
      <div className="nft-card__price">{`${price} ETH`}</div>
    </div>
  );
};

export default NFTCard;
