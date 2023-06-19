import { FC, ReactElement } from 'react';

import classNames from 'classnames';
import { NavLink, NavLinkProps } from 'react-router-dom';

import './ProfileNavigationNavLink.scss';

interface ProfileNavigationNavLinkProps extends NavLinkProps {
  isUpperCase?: boolean;
  className?: string;
}

const ProfileNavigationNavLink: FC<ProfileNavigationNavLinkProps> = ({ isUpperCase, className = '', ...props }): ReactElement => {
  const navLinkClassNames = classNames('profile-navigation-nav-link', {
    'profile-navigation-nav-link--is-uppercase': isUpperCase,
  }, className);

  return (
    <NavLink
      {...props}
      className={navLinkClassNames}
    />
  );
};

export default ProfileNavigationNavLink;
