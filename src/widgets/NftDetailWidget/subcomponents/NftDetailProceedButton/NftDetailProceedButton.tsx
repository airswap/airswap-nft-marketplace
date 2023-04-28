import React from 'react';

import { NavLink } from 'react-router-dom';

import { AppRoutes } from '../../../../routes';

import './NftDetailProceedButton.scss';

interface NftDetailProceedButtonProps {
  id?: string;
  className?: string;
}

const NftDetailProceedButton: React.FC<NftDetailProceedButtonProps> = ({
  id,
  className = '',
}) => (
  <div className={`nft-detail-proceed-button ${className}`}>
    <NavLink
      to={`/${AppRoutes.nftDetail}/${id}/buy`}
      className={`nft-detail-proceed-button__link ${className}__link`}
    >
      Proceed to buy
    </NavLink>
  </div>
);

export default NftDetailProceedButton;
