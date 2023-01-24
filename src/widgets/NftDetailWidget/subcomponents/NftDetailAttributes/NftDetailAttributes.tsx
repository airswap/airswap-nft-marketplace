import React, { FC } from 'react';

import { Attribute } from '../../../../redux/stores/collection/collectionSlice';
import NftDetailAttributeCard from '../NftDetailAttributeCard/NftDetailAttributeCard';

interface NftDetailAttributesProps {
  attrs: Array<Attribute>;
  className?: string;
}

const NftDetailAttributes: FC<NftDetailAttributesProps> = ({ attrs, className = '' }) => (
  <div className={`nft-detail-widget__attributes ${className}`}>
    {attrs.map((attribute: Attribute) => (
      <NftDetailAttributeCard key={attribute.trait_type} label={attribute.trait_type} value={attribute.value} />
    ))}
  </div>
);

export default NftDetailAttributes;
