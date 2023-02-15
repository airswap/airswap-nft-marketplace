import React, { FC, useMemo } from 'react';

import { TokenInfo } from '@airswap/typescript';
import { format } from '@greypixel_/nicenumbers';
import { BigNumber } from 'bignumber.js';

import './TradeDetails.scss';

interface TradeDetailsProps {
  amount: BigNumber;
  title: string;
  tokenInfo: TokenInfo;
  className?: string;
}

const TradeDetails: FC<TradeDetailsProps> = ({
  amount,
  title,
  tokenInfo,
  className = '',
}) => {
  const readableAmount = useMemo(() => format(amount, {
    tokenDecimals: tokenInfo.decimals,
    significantFigures: 6,
  }), [amount, tokenInfo]);

  return (
    <div className={`trade-details ${className}`}>
      <div className="trade-details__icon" style={{ backgroundImage: `url("${tokenInfo.logoURI}")` }} />
      <div className="trade-details__title-and-name">
        <h3 className="trade-details__title">{title}</h3>
        <h4 className="trade-details__name">{tokenInfo.symbol}</h4>
      </div>
      <div className="trade-details__amount">{readableAmount}</div>
    </div>
  );
};

export default TradeDetails;
