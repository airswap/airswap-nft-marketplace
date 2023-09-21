import React, { useMemo } from 'react';

import { NavLink } from 'react-router-dom';

import './NftDetailProceedButton.scss';

interface NftDetailProceedButtonProps {
  accountIsOwner: boolean;
  listRoute?: string;
  orderRoute?: string;
  className?: string;
}

const NftDetailProceedButton: React.FC<NftDetailProceedButtonProps> = ({
  accountIsOwner,
  listRoute,
  orderRoute,
  className = '',
}) => {
  const navLink = useMemo(() => {
    if (listRoute && accountIsOwner) {
      return (
        <NavLink
          to={listRoute}
          className="nft-detail-proceed-button__link"
        >
          List token
        </NavLink>
      );
    }

    if (orderRoute) {
      return (
        <NavLink
          to={orderRoute}
          className="nft-detail-proceed-button__link"
        >
          {accountIsOwner ? 'Cancel listing' : 'Proceed to buy'}
        </NavLink>
      );
    }

    return null;
  }, [accountIsOwner, listRoute, orderRoute]);

  return (
    <div className={`nft-detail-proceed-button ${className}`}>
      {navLink}
    </div>
  );
};

export default NftDetailProceedButton;
