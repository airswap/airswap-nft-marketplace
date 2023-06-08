import { FC, ReactElement } from 'react';

import ProfileNavigationNavLink from '../ProfileNavigationNavLink/ProfileNavigationNavLink';

import './ProfileNavigation.scss';

interface ProfileNavigationProps {
  className?: string;
}

const ProfileNavigation: FC<ProfileNavigationProps> = ({ className = '' }): ReactElement => (
  <div className={`profile-navigation ${className}`}>
    <ProfileNavigationNavLink to="">
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
      to="orders"
    >
      Listed
    </ProfileNavigationNavLink>
  </div>
);

export default ProfileNavigation;
