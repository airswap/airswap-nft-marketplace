import { FC, ReactElement } from 'react';

import { AppRoutes, ProfileRoutes } from '../../../../routes';
import ProfileNavigationNavLink from '../ProfileNavigationNavLink/ProfileNavigationNavLink';

import './ProfileNavigation.scss';

interface ProfileNavigationProps {
  account: string;
  className?: string;
}

const ProfileNavigation: FC<ProfileNavigationProps> = ({ account, className = '' }): ReactElement => (
  <div className={`profile-navigation ${className}`}>
    <ProfileNavigationNavLink to={`/${AppRoutes.profile}/${account}`}>
      NFT&apos;s
    </ProfileNavigationNavLink>
    <ProfileNavigationNavLink
      isUpperCase
      to="activity"
      aria-disabled
    >
      Activity
    </ProfileNavigationNavLink>
    <ProfileNavigationNavLink
      isUpperCase
      to={`/${AppRoutes.profile}/${account}/${ProfileRoutes.orders}`}
    >
      Listed
    </ProfileNavigationNavLink>
  </div>
);

export default ProfileNavigation;
