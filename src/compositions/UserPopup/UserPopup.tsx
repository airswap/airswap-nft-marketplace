import { FC } from 'react';

import { NavLink } from 'react-router-dom';

import { AppRoutes } from '../../routes';
import IconButton from '../IconButton/IconButton';

import './UserPopup.scss';

interface UserPopupProps {
  address: string;
  ENS?: string;
  onLogoutClick: () => void;
  className?: string;
}

const UserPopup: FC<UserPopupProps> = (
  {
    address, ENS, onLogoutClick, className,
  },
) => (
  <div className={`${className} user-popup`}>
    <div className="user-popup__address-bar">
      <div>
        <div className="user-popup__address-primary">{ENS || address}</div>
        {ENS && <div className="user-popup__address-secondary">{address}</div>}
      </div>
      <IconButton text="" icon="logout" className="user-popup__logout-button" onClick={onLogoutClick} />
    </div>
    <NavLink to={`/${AppRoutes.profile}`} className="user-popup__nav-link">Profile</NavLink>
    <NavLink to={`/${AppRoutes.profile}`} className="user-popup__nav-link">NFTs</NavLink>
    <NavLink to={`/${AppRoutes.profile}`} className="user-popup__nav-link">Listed</NavLink>
    <NavLink to={`/${AppRoutes.profile}`} className="user-popup__nav-link">Activity</NavLink>
  </div>
);

export default UserPopup;
