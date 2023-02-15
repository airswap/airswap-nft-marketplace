import React, { FC } from 'react';

import { TokenInfo } from '@airswap/typescript';

import './TradeNftDetails.scss';

interface TradeNftDetailsProps {
  collectionImage: string;
  collectionName: string;
  collectionToken: TokenInfo; // should be CollectionToken
  className?: string;
}

const TradeNftDetails: FC<TradeNftDetailsProps> = ({
  collectionImage,
  collectionName,
  collectionToken,
  className = '',
}) => (
  <div
    style={{ backgroundImage: `url("${collectionToken.logoURI}")` }}
    className={`trade-nft-details ${className}`}
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
);

export default TradeNftDetails;
