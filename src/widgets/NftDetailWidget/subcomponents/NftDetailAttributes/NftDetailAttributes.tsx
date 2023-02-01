import React, { FC } from 'react';

import NftDetailAttributeCard from '../NftDetailAttributeCard/NftDetailAttributeCard';

export interface Attribute {
  'trait_type': string;
  value: string;
}

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
