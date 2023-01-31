import React, { useRef } from 'react';

import { useEventListener } from 'usehooks-ts';

import './NftCard.scss';

interface NftCardProps {
  imageURI: string;
  name: string;
  price: number;
  onClick?: (e: MouseEvent) => void;
  className?: string;
}

const NftCard = ({
  imageURI, name, price, className, onClick,
}: NftCardProps) => {
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

export default NftCard;
