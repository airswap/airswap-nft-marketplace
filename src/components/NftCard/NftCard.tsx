import React, { useEffect } from 'react';

import { NavLink, NavLinkProps } from 'react-router-dom';

import { makeRateLimitedIpfsRequest } from '../../helpers/ipfsUtils';

import './NftCard.scss';

interface NftCardProps extends NavLinkProps {
  imageURI: string;
  name: string;
  price: number;
  className?: string;
}

const NftCard = ({
  imageURI,
  name,
  price,
  to,
  className = '',
}: NftCardProps) => {
  let imagePromise: Promise<any>;
  // TODO: Use a default image or do something for loading.
  const [imageData, setImageData] = React.useState<string>();

  useEffect(() => {
    imagePromise = makeRateLimitedIpfsRequest(imageURI);
    imagePromise.then((base64String) => {
      setImageData(`data:image/png;base64,${base64String}`);
    });
  }, []);

  return (
    <NavLink to={to} className={`nft-card ${className}`}>
      <img className="nft-card__img" src={imageData} alt={name} />
      <div className="nft-card__info-wrapper">
        <h3 className="nft-card__name">{name}</h3>
        <h4 className="nft-card__price">{`${price} ETH`}</h4>
      </div>
    </NavLink>
  );
};

export default NftCard;
