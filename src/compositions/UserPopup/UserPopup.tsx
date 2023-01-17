import { FC } from 'react';

import { NavLink } from 'react-router-dom';

import WalletInfo from '../../components/WalletInfo/WalletInfo';
import { AppRoutes } from '../../routes';

import './UserPopup.scss';

interface UserPopupProps {
  address: string;
  ensAddress?: string;
  onDisconnectClick: () => void;
  className?: string;
}

const UserPopup: FC<UserPopupProps> = (
  {
    address, ensAddress, onDisconnectClick, className,
  },
) => (
  <div className={`${className} user-popup`}>
    <WalletInfo address={address} ensAddress={ensAddress} isMobileMenu={false} onDisconnectClick={onDisconnectClick} className="user-popup__wallet-info" />
    <NavLink to={`/${AppRoutes.profile}`} className="user-popup__nav-link">Profile</NavLink>
    <NavLink to={`/${AppRoutes.profile}`} className="user-popup__nav-link">NFTs</NavLink>
    <NavLink to={`/${AppRoutes.profile}`} className="user-popup__nav-link">Listed</NavLink>
    <NavLink to={`/${AppRoutes.profile}`} className="user-popup__nav-link">Activity</NavLink>
  </div>
);

export default UserPopup;
