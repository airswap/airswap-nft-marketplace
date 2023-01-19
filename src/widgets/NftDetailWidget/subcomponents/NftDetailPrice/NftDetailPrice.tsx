import React, { FC } from 'react';

import { format } from '@greypixel_/nicenumbers';
import { BigNumber } from 'ethers';

import './NftDetailPrice.scss';

interface NftDetailPriceProps {
  price: BigNumber;
  className?: string;
}

const NftDetailPrice: FC<NftDetailPriceProps> = ({ price, className = '' }) => (
  <div className={`nft-detail-price ${className}`}>
    <p>{format(price)}</p>
  </div>
);

export default NftDetailPrice;
