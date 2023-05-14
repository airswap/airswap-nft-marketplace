import React from 'react';

import { NavLink } from 'react-router-dom';

import './NftDetailProceedButton.scss';

interface NftDetailProceedButtonProps {
  className?: string;
}

const NftDetailProceedButton: React.FC<NftDetailProceedButtonProps> = ({ className = '' }) => (
  <div className={`nft-detail-proceed-button ${className}`}>
    <NavLink
      to="buy"
      className="nft-detail-proceed-button__link"
    >
      Proceed to buy
    </NavLink>
  </div>
);

export default NftDetailProceedButton;
