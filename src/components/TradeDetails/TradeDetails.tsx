import React, { FC, useMemo } from 'react';

import { CollectionTokenInfo, TokenInfo } from '@airswap/types';
import { format } from '@greypixel_/nicenumbers';
import { BigNumber } from 'bignumber.js';

import './TradeDetails.scss';

interface TradeDetailsProps {
  amount?: BigNumber;
  amountSubtext?: string;
  logoURI?: string;
  title: string;
  token: TokenInfo | CollectionTokenInfo;
  className?: string;
}

const TradeDetails: FC<TradeDetailsProps> = ({
  amount,
  amountSubtext,
  logoURI,
  title,
  token,
  className = '',
}) => {
  const symbol = 'symbol' in token && token.symbol;
  const name = 'name' in token && token.name;
  const id = 'id' in token && token.id;
  const decimals = 'decimals' in token;

  const readableAmount = useMemo(() => {
    if (!amount || !(decimals)) {
      return undefined;
    }

    return format(amount, {
      tokenDecimals: token.decimals,
      significantFigures: 6,
    });
  }, [amount, decimals, token]);

  return (
    <div className={`trade-details ${className}`}>
      <div className="trade-details__icon" style={{ backgroundImage: `url("${logoURI}")` }} />
      <div className="trade-details__title-and-name">
        <h3 className="trade-details__title">{title}</h3>
        <h4 className="trade-details__name">{symbol || `${name} #${id}`}</h4>
      </div>
      <div className="trade-details__amount-container">
        <div className="trade-details__amount-container-content">
          {readableAmount && <span className="trade-details__amount">{readableAmount}</span>}
          {amountSubtext && <span className="trade-details__amount-subtext">{amountSubtext}</span>}
        </div>
      </div>
    </div>
  );
};

export default TradeDetails;
