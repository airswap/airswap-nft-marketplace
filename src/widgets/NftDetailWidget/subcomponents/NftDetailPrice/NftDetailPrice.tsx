import React, { FC } from 'react';

import { format } from '@greypixel_/nicenumbers';
import { BigNumber } from 'ethers';

import './NftDetailPrice.scss';

interface NftDetailPriceProps {
  price?: BigNumber;
  className?: string;
}

const NftDetailPrice: FC<NftDetailPriceProps> = ({ price, className = '' }) => (
  <div className={`nft-detail-price ${className}`}>
    <h3>{price ? `${format(price)} ${process.env.REACT_APP_PAYMENT_TOKEN}` : null}</h3>
  </div>
);

export default NftDetailPrice;
