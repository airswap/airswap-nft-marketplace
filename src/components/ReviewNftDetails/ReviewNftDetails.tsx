import React, { FC } from 'react';

import { CollectionToken } from '../../entities/CollectionToken/CollectionToken';

import './ReviewNftDetails.scss';

interface ReviewNftDetailsProps {
  token: CollectionToken;
  title: string;
  className?: string;
}

const ReviewNftDetails: FC<ReviewNftDetailsProps> = ({ title, token, className = '' }) => (
  <div className={`review-nft-details ${className}`}>
    <h3 className="review-nft-details__title">
      {title}
    </h3>
    <h4 className="review-nft-details__name">{`${token.name} #${token.id}`}</h4>
    <div className="review-nft-details__icon" style={{ backgroundImage: `url("${token.image}")` }} />
  </div>
);

export default ReviewNftDetails;
