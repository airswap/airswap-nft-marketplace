import React from 'react';

import './NftDetailContentContainer.scss';

interface NftDetailContentContainerProps {
  children: React.ReactNode;
  className?: string;
}

const NftDetailContentContainer: React.FC<NftDetailContentContainerProps> = ({
  children,
  className = '',
}) => (
  <div className={`nft-detail-content-container ${className}`}>
    {children}
  </div>
);

export default NftDetailContentContainer;
