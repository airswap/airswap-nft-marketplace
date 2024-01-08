import React, { FC, useMemo } from 'react';

import { FullOrder, TokenInfo } from '@airswap/types';

import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import {
  getFullOrderExpiryDate,
  getFullOrderReadableSenderAmountPlusTotalFees, isFullOrderExpired,
} from '../../../../entities/FullOrder/FullOrderHelpers';
import { getExpiryTranslation } from '../../../../helpers/date/getExpiryTranslation';

import './NftDetailSaleInfo.scss';

interface NftDetailSaleInfoProps {
  isLoading?: boolean;
  tokenInfo: TokenInfo;
  order?: FullOrder;
  className?: string;
}

const NftDetailSaleInfo: FC<NftDetailSaleInfoProps> = ({
  isLoading,
  tokenInfo,
  order,
  className = '',
}) => {
  const price = useMemo(() => (order ? getFullOrderReadableSenderAmountPlusTotalFees(order, tokenInfo) : undefined), [order]);
  const expiry = useMemo(() => {
    if (!order || isFullOrderExpired(order)) {
      return undefined;
    }

    return getExpiryTranslation(getFullOrderExpiryDate(order), new Date());
  }, [order]);
  const { symbol } = tokenInfo;

  if (isLoading) {
    return (
      <div className={`nft-detail-sale-info ${className}`}>
        <LoadingSpinner className="nft-detail-sale-info__loading-spinner" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className={`nft-detail-sale-info ${className}`}>
      <h3 className="nft-detail-sale-info__price">
        {price ? `${price} ${symbol}` : null}
      </h3>
      {expiry && (
        <h4 className="nft-detail-sale-info__expiry">
          Expires in
          <span className="nft-detail-sale-info__expiry-date">{expiry}</span>
        </h4>
      )}
    </div>
  );
};

export default NftDetailSaleInfo;
