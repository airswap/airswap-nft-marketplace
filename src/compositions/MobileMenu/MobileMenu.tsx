import React, { FC } from 'react';

import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

import WalletInfo from '../../components/WalletInfo/WalletInfo';
import { routes } from '../../routes';

import './MobileMenu.scss';

interface MobileMenuProp {
  isHidden: boolean;
  avatarUrl?: string;
  address: string;
  ensAddress?: string | undefined;
  onNavLinkClick: () => void;
  className?: string;
}

const MobileMenu: FC<MobileMenuProp> = ({
  avatarUrl,
  isHidden,
  address,
  ensAddress,
  onNavLinkClick,
  className = '',
}) => {
  const mobileMenuClassName = classNames('mobile-menu', {
    'mobile-menu--is-hidden': isHidden,
  }, className);

  return (
    <div className={mobileMenuClassName}>
      <WalletInfo
        avatarUrl={avatarUrl}
        address={address}
        ensAddress={ensAddress}
      />
      <div className="mobile-menu__nav-links">
        <NavLink
          to={routes.profile(address)}
          onClick={onNavLinkClick}
          className="mobile-menu__nav-link"
        >
          My Tokens
        </NavLink>
        <NavLink
          to={routes.userOrders(address)}
          onClick={onNavLinkClick}
          className="mobile-menu__nav-link"
        >
          My Listings
        </NavLink>
        <NavLink
          to={routes.listNft()}
          onClick={onNavLinkClick}
          className="mobile-menu__nav-link"
        >
          List a Token
        </NavLink>
      </div>
    </div>
  );
};

export default MobileMenu;
