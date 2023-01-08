import { FC } from 'react';

import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

import WallelInfo from '../../../components/WalletInfo/WalletInfo';
import { AppRoutes } from '../../../routes';

import './MobileMenu.scss';

interface MobileMenuProp {
  isHidden: boolean;
  className?: string;
}

const MobileMenu: FC<MobileMenuProp> = ({ isHidden, className = '' }) => {
  const containerClassName = classNames('container', {
    'container--is-hidden': isHidden,
  }, className);

  return (
    <div className={containerClassName}>
      <WallelInfo isBanner={false} />
      <NavLink className="container__nav-link" to="">My NFTs</NavLink>
      <NavLink className="container__nav-link" to="">My Activity</NavLink>
      <NavLink className="container__nav-link" to="">My Listed NFTs</NavLink>
      <NavLink className="container__nav-link" to={`/${AppRoutes.listNft}`}>List NFT</NavLink>
      <NavLink className="container__nav-link" to="">Project Discord</NavLink>
    </div>
  );
};

export default MobileMenu;
