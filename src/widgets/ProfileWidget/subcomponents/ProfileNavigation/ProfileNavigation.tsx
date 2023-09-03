import { FC, ReactElement } from 'react';

import { routes } from '../../../../routes';
import ProfileNavigationNavLink from '../ProfileNavigationNavLink/ProfileNavigationNavLink';

import './ProfileNavigation.scss';

interface ProfileNavigationProps {
  account: string;
  className?: string;
}

const ProfileNavigation: FC<ProfileNavigationProps> = ({ account, className = '' }): ReactElement => (
  <div className={`profile-navigation ${className}`}>
    <ProfileNavigationNavLink to={routes.profile(account)}>
      All tokens
    </ProfileNavigationNavLink>
    <ProfileNavigationNavLink
      to="activity"
      aria-disabled
    >
      Activity
    </ProfileNavigationNavLink>
    <ProfileNavigationNavLink
      to={routes.userOrders(account)}
    >
      For sale
    </ProfileNavigationNavLink>
  </div>
);

export default ProfileNavigation;
