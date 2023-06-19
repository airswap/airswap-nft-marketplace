import React, { FC } from 'react';

import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

import './NftDetailSaleInfo.scss';

interface NftDetailSaleInfoProps {
  isLoading?: boolean;
  price?: string;
  symbol: string;
  className?: string;
}

const NftDetailSaleInfo: FC<NftDetailSaleInfoProps> = ({
  isLoading,
  price,
  symbol,
  className = '',
}) => (
  <div className={`nft-detail-sale-info ${className}`}>
    {isLoading ? (
      <LoadingSpinner className="nft-detail-sale-info__loading-spinner" />
    ) : (
      <h3 className="nft-detail-sale-info__price">
        {price ? `${price} ${symbol}` : null}
      </h3>
    )}
  </div>
);

export default NftDetailSaleInfo;
