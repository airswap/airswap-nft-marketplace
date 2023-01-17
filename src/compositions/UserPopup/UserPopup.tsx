import { FC } from 'react';

import { AppRoutes } from '../../routes';
import IconButton from '../IconButton/IconButton';

import './UserPopup.scss';

interface UserPopupProps {
  address: string;
  ENS?: string;
  onLogoutClick: () => void;
}

const UserPopup: FC<UserPopupProps> = (
  {
    address, ENS, onLogoutClick,
  },
) => (
  <div className="user-popup">
    <div className="user-popup__address-bar">
      <div>
        <div className="user-popup__address-primary">{ENS || address}</div>
        {ENS && <div className="user-popup__address-secondary">{address}</div>}
      </div>
      <IconButton text="" icon="logout" className="user-popup__logout-button" onClick={onLogoutClick} />
    </div>
    <a href={`./${AppRoutes.profile}`} className="user-popup__nav-link">Profile</a>
    <a href={`./${AppRoutes.profile}`} className="user-popup__nav-link">NFTs</a>
    <a href={`./${AppRoutes.profile}`} className="user-popup__nav-link">Listed</a>
    <a href={`./${AppRoutes.profile}`} className="user-popup__nav-link">Activity</a>
  </div>
);

export default UserPopup;
