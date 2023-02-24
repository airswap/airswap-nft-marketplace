import React from 'react';

import { Link } from 'react-router-dom';

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
    <Link to={`/${AppRoutes.swap}/${id}`} className={`nft-detail-proceed-button__link ${className}__link ${id ? '' : 'disabled'}`}>
      Proceed to buy
    </Link>
  </div>
);

export default NftDetailProceedButton;
