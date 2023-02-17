import React, { FC } from 'react';

import { CollectionTokenAttribute } from '../../../../entities/CollectionToken/CollectionToken';
import NftDetailAttributeCard from '../NftDetailAttributeCard/NftDetailAttributeCard';

import './NftDetailAttributes.scss';

interface NftDetailAttributesProps {
  attrs: Array<CollectionTokenAttribute>;
  className?: string;
}

const NftDetailAttributes: FC<NftDetailAttributesProps> = ({ attrs, className = '' }) => (
  <div className={`nft-detail-attributes ${className}`}>
    {attrs.map((attribute: CollectionTokenAttribute) => (
      <NftDetailAttributeCard className="nft-detail-attributes__card" key={attribute.label} label={attribute.label} value={attribute.value} />
    ))}
  </div>
);

export default NftDetailAttributes;
