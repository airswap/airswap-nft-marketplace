import React, { FC } from 'react';

import './NftDetailAccordian.scss';

interface NftDetailAccordianProps {
  label: string;
  content: string | JSX.Element;
  className?: string;
}

const NftDetailAccordian: FC<NftDetailAccordianProps> = ({ label, content, className = '' }) => (
  <div className={`nft-detail-accordian ${className}`}>
    <div>
      <p>{label}</p>
    </div>
    <div>
      {typeof content === 'string' ? <p>{content}</p> : content}
    </div>
  </div>
);

export default NftDetailAccordian;
