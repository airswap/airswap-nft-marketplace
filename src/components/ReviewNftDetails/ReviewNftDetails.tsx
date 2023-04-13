import React, { FC } from 'react';

import { CollectionTokenInfo } from '@airswap/types';

import './ReviewNftDetails.scss';

interface ReviewNftDetailsProps {
  logoURI: string;
  title: string;
  token?: CollectionTokenInfo;
  className?: string;
}

const ReviewNftDetails: FC<ReviewNftDetailsProps> = ({
  logoURI,
  title,
  token,
  className = '',
}) => (
  <div className={`review-nft-details ${className}`}>
    <h3 className="review-nft-details__title">
      {title}
    </h3>
    <h4 className="review-nft-details__name">{token?.name}</h4>
    <div className="review-nft-details__icon" style={{ backgroundImage: `url("${logoURI}")` }} />
  </div>
);

export default ReviewNftDetails;
