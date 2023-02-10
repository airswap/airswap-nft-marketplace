import React, { FC } from 'react';

import { Attribute } from '../../../../redux/stores/nftDetail/nftDetailSlice';
import NftDetailAttributeCard from '../NftDetailAttributeCard/NftDetailAttributeCard';

import './NftDetailAttributes.scss';

interface NftDetailAttributesProps {
  attrs: Array<Attribute>;
  className?: string;
}

const NftDetailAttributes: FC<NftDetailAttributesProps> = ({ attrs, className = '' }) => (
  <div className={`nft-detail-attributes ${className}`}>
    {attrs.map((attribute: Attribute) => (
      <NftDetailAttributeCard className="nft-detail-attributes__card" key={attribute.trait_type} label={attribute.trait_type} value={attribute.value} />
    ))}
  </div>
);

export default NftDetailAttributes;
