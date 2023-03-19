import React, { FC } from 'react';

import { TokenInfo } from '@airswap/types';

import './ReviewNftDetails.scss';

interface ReviewNftDetailsProps {
  title: string;
  token: TokenInfo;
  tokenId: string;
  className?: string;
}

const ReviewNftDetails: FC<ReviewNftDetailsProps> = ({
  title,
  token,
  tokenId,
  className = '',
}) => (
  <div className={`review-nft-details ${className}`}>
    <h3 className="review-nft-details__title">
      {title}
    </h3>
    <h4 className="review-nft-details__name">{`${token.name} #${tokenId}`}</h4>
    <div className="review-nft-details__icon" style={{ backgroundImage: `url("${token.logoURI}")` }} />
  </div>
);

export default ReviewNftDetails;
