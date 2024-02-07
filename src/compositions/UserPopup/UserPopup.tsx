import {
  FC,
  forwardRef,
  ReactElement,
  Ref,
  RefAttributes,
} from 'react';

import { NavLink } from 'react-router-dom';

import Button from '../../components/Button/Button';
import WalletInfo from '../../components/WalletInfo/WalletInfo';
import { routes } from '../../routes';
import GithubInfo from '../GithubInfo/GithubInfo';

import './UserPopup.scss';

interface UserPopupProps {
  showDisableDemoAccountButton: boolean;
  address?: string;
  ensAddress?: string;
  onDisableDemoAccountButtonClick: () => void;
  onLogoutButtonClick: () => void;
  className?: string;
}

export type UserPopupWithRefProps = UserPopupProps & RefAttributes<HTMLDivElement>;

const UserPopup: FC<UserPopupWithRefProps> = forwardRef(({
  showDisableDemoAccountButton,
  address,
  ensAddress,
  onDisableDemoAccountButtonClick,
  onLogoutButtonClick,
  className = '',
}, ref: Ref<HTMLDivElement>): ReactElement => (
  <div ref={ref} className={`user-popup ${className}`}>
    <WalletInfo
      address={address}
      showLogOutButton
      ensAddress={ensAddress}
      onLogoutButtonClick={onLogoutButtonClick}
      className="user-popup__wallet-info"
      avatarClassName="user-popup__wallet-info-avatar"
    />

    {address && (
      <>
        <NavLink to={routes.profile(address)} className="user-popup__nav-link">My tokens</NavLink>
        <NavLink to={routes.userOrders(address)} className="user-popup__nav-link">My listing</NavLink>
      </>
    )}

    {showDisableDemoAccountButton && (
      <Button
        className="user-popup__button"
        onClick={onDisableDemoAccountButtonClick}
      >
        Exit demo account
      </Button>
    )}

    {process.env.BUILD_VERSION && (
      <GithubInfo className="user-popup__github-info" />
    )}
  </div>
));

export default UserPopup;
