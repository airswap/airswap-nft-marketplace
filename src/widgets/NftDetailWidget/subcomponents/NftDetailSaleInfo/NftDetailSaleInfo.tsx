import React, { FC } from 'react';

import { format } from '@greypixel_/nicenumbers';
import { BigNumber } from 'ethers';

import './NftDetailSaleInfo.scss';

interface NftDetailSaleInfoProps {
  price?: BigNumber;
  symbol?: string;
  className?: string;
}

const NftDetailSaleInfo: FC<NftDetailSaleInfoProps> = ({ price, symbol = 'undefined', className = '' }) => (
  <div className={`nft-detail-sale-info ${className}`}>
    <h3 className="nft-detail-sale-info__price">{price ? `${format(price)} ${symbol}` : null}</h3>
  </div>
);

export default NftDetailSaleInfo;
