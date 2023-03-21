import React, { FC } from 'react';

import { TokenInfo } from '@airswap/types';

import './ReviewNftDetails.scss';

interface ReviewNftDetailsProps {
  logoURI: string;
  title: string;
  token: TokenInfo;
  tokenId: number;
  className?: string;
}

const ReviewNftDetails: FC<ReviewNftDetailsProps> = ({
  logoURI,
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
    <div className="review-nft-details__icon" style={{ backgroundImage: `url("${logoURI}")` }} />
  </div>
);

export default ReviewNftDetails;
