import { FC } from 'react';

import IconButton from '../IconButton/IconButton';

import './UserPopup.scss';

interface UserPopupProps {
  isENS: boolean;
  account: string;
}

const UserPopup: FC<UserPopupProps> = (
  { isENS, account },
) => (
  <div className="user-popup">
    <div className="user-popup__address-bar">
      <div>
        <div className="user-popup__address-primary">swapthebestnft.eth</div>
        {isENS && <div className="user-popup__address-secondary">{account}</div>}
      </div>
      <IconButton text="" icon="logout" className="user-popup__logout-button" />
    </div>
    <div className="user-popup__nav-link">Profile</div>
    <div className="user-popup__nav-link">NFTs</div>
    <div className="user-popup__nav-link">Listed</div>
    <div className="user-popup__nav-link">Activity</div>
  </div>
);

export default UserPopup;
