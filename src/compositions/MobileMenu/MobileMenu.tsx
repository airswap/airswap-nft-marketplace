import React, { FC } from 'react';

import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

import Button from '../../components/Button/Button';
import WalletInfo from '../../components/WalletInfo/WalletInfo';
import { routes } from '../../routes';

import './MobileMenu.scss';

interface MobileMenuProp {
  isHidden: boolean;
  showDisableDemoAccountButton: boolean;
  avatarUrl?: string;
  address: string;
  ensAddress?: string | undefined;
  onDisableDemoAccountButtonClick: () => void;
  onNavLinkClick: () => void;
  onLogoutButtonClick: () => void;
  className?: string;
}

const MobileMenu: FC<MobileMenuProp> = ({
  isHidden,
  showDisableDemoAccountButton,
  avatarUrl,
  address,
  ensAddress,
  onDisableDemoAccountButtonClick,
  onNavLinkClick,
  onLogoutButtonClick,
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
        showLogOutButton
        onLogoutButtonClick={onLogoutButtonClick}
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
        {showDisableDemoAccountButton && (
          <Button
            text="Disable Demo Account"
            onClick={onDisableDemoAccountButtonClick}
            className="mobile-menu__nav-link"
          />
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
