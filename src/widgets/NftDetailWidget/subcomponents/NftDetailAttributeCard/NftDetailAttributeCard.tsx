import React, { FC } from 'react';

import './NftDetailAttributeCard.scss';

interface NftDetailAttributeCardProps {
  label: string;
  value: string | number;
  className?: string;
}

const NftDetailAttributeCard: FC<NftDetailAttributeCardProps> = ({
  label,
  value,
  className = '',
}) => (
  <div key={label} className={`nft-detail-attribute-card ${className}`}>
    <p className="nft-detail-attribute-card__label">{label}</p>
    <p className="nft-detail-attribute-card__value">{value}</p>
  </div>
);

export default NftDetailAttributeCard;
