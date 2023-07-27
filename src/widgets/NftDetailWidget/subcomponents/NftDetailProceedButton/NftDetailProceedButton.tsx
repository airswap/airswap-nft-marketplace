import React from 'react';

import { NavLink } from 'react-router-dom';

import './NftDetailProceedButton.scss';

interface NftDetailProceedButtonProps {
  accountIsOwner: boolean;
  route: string;
  className?: string;
}

const NftDetailProceedButton: React.FC<NftDetailProceedButtonProps> = ({ accountIsOwner, route, className = '' }) => (
  <div className={`nft-detail-proceed-button ${className}`}>
    <NavLink
      to={route}
      className="nft-detail-proceed-button__link"
    >
      {accountIsOwner ? 'Cancel listing' : 'Proceed to buy'}
    </NavLink>
  </div>
);

export default NftDetailProceedButton;
