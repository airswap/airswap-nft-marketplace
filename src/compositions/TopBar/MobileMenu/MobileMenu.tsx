import {
  FC, useEffect, useRef, useState,
} from 'react';

import { NavLink } from 'react-router-dom';

import WallelInfo from '../../../components/WalletInfo/WalletInfo';
import { AppRoutes } from '../../../routes';

import './MobileMenu.scss';

interface MobileMenuProp {
  displayMenu: boolean;
  className?: string;
}

const MobileMenu: FC<MobileMenuProp> = ({ displayMenu, className = '' }) => {
  const [hide, setHide] = useState<boolean>(!displayMenu);
  const [show, setShow] = useState<boolean>(displayMenu);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const animationManagement = (): void => {
    if (displayMenu) {
      setHide(false);
      setShow(true);
      clearTimeout(timeoutRef.current);
    } else {
      setShow(false);
      timeoutRef.current = setTimeout(() => setHide(true), 500);
    }
  };
  useEffect(() => {
    animationManagement();
  }, [displayMenu]);
  useEffect(() => () => clearTimeout(timeoutRef.current), []);
  const template = !hide ? (
    <div className={`container ${!show ? 'container--fly-out' : ''} ${className}`}>
      <WallelInfo isBanner={false} />
      <NavLink className="container__nav-link" to="">My NFTs</NavLink>
      <NavLink className="container__nav-link" to="">My Activity</NavLink>
      <NavLink className="container__nav-link" to="">My Listed NFTs</NavLink>
      <NavLink className="container__nav-link" to={`/${AppRoutes.listNft}`}>List NFT</NavLink>
      <NavLink className="container__nav-link" to="">Project Discord</NavLink>
    </div>
  ) : null;
  return template;
};

export default MobileMenu;
