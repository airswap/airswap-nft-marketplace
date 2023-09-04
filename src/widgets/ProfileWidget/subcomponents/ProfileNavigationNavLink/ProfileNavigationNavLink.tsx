import { FC, ReactElement } from 'react';

import { NavLink, NavLinkProps } from 'react-router-dom';

import './ProfileNavigationNavLink.scss';

interface ProfileNavigationNavLinkProps extends NavLinkProps {
  className?: string;
}

const ProfileNavigationNavLink: FC<ProfileNavigationNavLinkProps> = ({ className = '', ...props }): ReactElement => (
  <NavLink
    {...props}
    className={`profile-navigation-nav-link ${className}`}
  />
);

export default ProfileNavigationNavLink;
