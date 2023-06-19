import React from 'react';

import { NavLink, NavLinkProps } from 'react-router-dom';

import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

import './NftCardSkeleton.scss';

interface NftCardSkeletonProps extends NavLinkProps {
  price?: string;
  symbol?: string;
  className?: string;
}

const NftCardSkeleton = ({
  price,
  symbol,
  to,
  className = '',
}: NftCardSkeletonProps) => (
  <NavLink
    to={to}
    className={`nft-card-skeleton ${className}`}
  >
    <div className="nft-card-skeleton__loader-wrapper">
      <LoadingSpinner className="nft-card__loader" />
    </div>
    <div className="nft-card-skeleton__info-wrapper">
      <h3 className="nft-card__name">&nbsp;</h3>
      {(price && symbol) && (
        <h4 className="nft-card__price">
          {`${price} ${symbol}`}
        </h4>
      )}
    </div>
  </NavLink>
);

export default NftCardSkeleton;
