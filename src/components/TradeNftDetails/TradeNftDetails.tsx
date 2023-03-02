import React, { FC } from 'react';

import { TokenInfo } from '@airswap/typescript';
import classNames from 'classnames';

import Icon from '../Icon/Icon';

import './TradeNftDetails.scss';

export interface TradeNftDetailsProps {
  collectionImage: string;
  collectionName: string;
  collectionToken: TokenInfo; // TODO: should be CollectionToken
  icon?: 'success' | 'failed';
  className?: string;
}

const TradeNftDetails: FC<TradeNftDetailsProps> = ({
  collectionImage,
  collectionName,
  collectionToken,
  icon,
  className = '',
}) => {
  const wrapperClassName = classNames('trade-nft-details', {
    [`trade-nft-details--has-${icon}-icon`]: icon,
  }, className);

  return (
    <div className={wrapperClassName}>
      {icon && (
        <div className="trade-nft-details__check-icon-container">
          <div className="trade-nft-details__check-icon-circle">
            <Icon
              name={icon === 'failed' ? 'close' : 'check'}
              className="trade-nft-details__check-icon"
            />
          </div>
        </div>
      )}
      <div
        style={{ backgroundImage: `url("${collectionToken.logoURI}")` }}
        className="trade-nft-details__inner"
      >
        <h2 className="trade-nft-details__token-name">{collectionToken.name}</h2>
        <div className="trade-nft-details__portrait-and-collection-details">
          <div
            style={{ backgroundImage: `url("${collectionImage}")` }}
            className="trade-nft-details__collection-portrait"
          />
          <div className="trade-nft-details__collection-details">
            <h3 className="trade-nft-details__collection-name">{collectionName}</h3>
            <h4 className="trade-nft-details__collection-author">By Sjnivo</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeNftDetails;