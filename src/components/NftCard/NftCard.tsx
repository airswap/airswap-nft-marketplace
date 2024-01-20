import React, { CSSProperties } from 'react';

import classNames from 'classnames';
import { NavLink, NavLinkProps } from 'react-router-dom';

import './NftCard.scss';

interface NftCardProps extends NavLinkProps {
  isDisabled?: boolean;
  isHighlighted?: boolean;
  balance?: string;
  expiry?: Date;
  id: string;
  imageURI?: string;
  label?: string;
  name?: string;
  price?: string;
  symbol?: string;
  className?: string;
}

const NftCard = ({
  isDisabled,
  isHighlighted,
  balance,
  id,
  expiry,
  imageURI,
  label,
  name,
  price,
  symbol,
  to,
  className = '',
}: NftCardProps) => {
  const linkClassName = classNames('nft-card', {
    'nft-card--is-disabled': isDisabled,
    'nft-card--is-highlighted': isHighlighted,
  }, className);

  const isExpired = expiry && expiry < new Date();
  const expiryTranslation = isExpired ? 'Sale ended' : 'Sale ends';

  const cssProperties: CSSProperties = {
    viewTransitionName: `nft-image-${id}`,
  };

  return (
    <NavLink
      unstable_viewTransition
      to={to}
      className={linkClassName}
    >
      <img
        src={imageURI}
        alt={name}
        style={cssProperties}
        className="nft-card__img"
      />
      {(label || balance) && (
        <div className="nft-card__header">
          {label && <div className="nft-card__label">{label}</div>}
          {balance && <div className="nft-card__balance">{`${balance}x`}</div>}
        </div>
      )}
      <div className="nft-card__info-wrapper">
        <h3 className="nft-card__name">{name}</h3>
        <h4 className="nft-card__price">
          {(price && symbol) ? `${price} ${symbol}` : <>&nbsp;</>}
        </h4>
        {expiry && (
          <h5 className="nft-card__expiry">{`${expiryTranslation} ${expiry.toLocaleString()}`}</h5>
        )}
      </div>
    </NavLink>
  );
};

export default NftCard;
