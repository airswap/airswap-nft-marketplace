import React, { FC } from 'react';

import './DesktopNav.scss';

interface DesktopNavProps {
  className?: string;
}

const DesktopNav: FC<DesktopNavProps> = ({ className = '' }) => (
  <div className={`desktop-nav ${className}`}>
    <a
      href="https://about.airswap.io/"
      rel="noreferrer"
      target="_blank"
      className="desktop-nav__link"
    >
      About
    </a>
    <a
      href="https://about.airswap.io/"
      rel="noreferrer"
      target="_blank"
      className="desktop-nav__link"
    >
      Explore
    </a>
    <a
      href="https://chat.airswap.io/"
      rel="noreferrer"
      target="_blank"
      className="desktop-nav__link"
    >
      Discord
    </a>
    <a
      href="https://twitter.com/airswap"
      rel="noreferrer"
      target="_blank"
      className="desktop-nav__link"
    >
      Twitter
    </a>
  </div>
);

export default DesktopNav;
