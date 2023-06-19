import React from 'react';

import { NavLink } from 'react-router-dom';

import './NftDetailProceedButton.scss';

interface NftDetailProceedButtonProps {
  route: string;
  className?: string;
}

const NftDetailProceedButton: React.FC<NftDetailProceedButtonProps> = ({ route, className = '' }) => (
  <div className={`nft-detail-proceed-button ${className}`}>
    <NavLink
      to={route}
      className="nft-detail-proceed-button__link"
    >
      Proceed to buy
    </NavLink>
  </div>
);

export default NftDetailProceedButton;
