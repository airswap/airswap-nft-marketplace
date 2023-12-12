import React, { FC, useMemo } from 'react';

import { FullOrder, TokenInfo } from '@airswap/types';

import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import {
  getFullOrderExpiryDate,
  getFullOrderReadableSenderAmountPlusTotalFees,
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
  const expiry = useMemo(() => (order ? (
      getExpiryTranslation(getFullOrderExpiryDate(order), new Date())
  ) : undefined), [order]);
  const { symbol } = tokenInfo;

  return (
    <div className={`nft-detail-sale-info ${className}`}>
      {isLoading ? (
        <LoadingSpinner className="nft-detail-sale-info__loading-spinner" />
        ) : (
          <>
            <h3 className="nft-detail-sale-info__price">
              {price ? `${price} ${symbol}` : null}
            </h3>
            <h4 className="nft-detail-sale-info__expiry">
              Expires in
              <span className="nft-detail-sale-info__expiry-date">{expiry}</span>
            </h4>
          </>
        )}
    </div>
  );
};

export default NftDetailSaleInfo;
