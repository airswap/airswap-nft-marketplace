import React from 'react';

import classNames from 'classnames';
import { NavLink, NavLinkProps } from 'react-router-dom';

import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

import './NftCardSkeleton.scss';

interface NftCardSkeletonProps extends NavLinkProps {
  isHighlighted?: boolean;
  price?: string;
  symbol?: string;
  className?: string;
}

const NftCardSkeleton = ({
  isHighlighted,
  price,
  symbol,
  to,
  className = '',
}: NftCardSkeletonProps) => {
  const linkClassName = classNames('nft-card-skeleton', {
    'nft-card--is-highlighted': isHighlighted,
  }, className);

  return (
    <NavLink
      to={to}
      className={linkClassName}
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
};

export default NftCardSkeleton;
