import {
  FC, useEffect, useRef, useState,
} from 'react';

import WallelInfo from '../../../components/WalletInfo/WalletInfo';

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
      <div>My NFTs</div>
      <div>My Activity</div>
      <div>My Listed NFTs</div>
      <div>List NFT</div>
      <div>Project Discord</div>
    </div>
  ) : null;
  return template;
};

export default MobileMenu;
