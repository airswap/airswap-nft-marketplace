import { FC } from 'react';

import IconButton from '../../compositions/IconButton/IconButton';

import './WalletInfo.scss';


interface WalletInfoProps {
  mode: 'BANNER' | 'MENU',
  className?: string
}

const WallelInfo: FC<WalletInfoProps> = ({ mode, className = '' }) => (
  <div className={`wallet-info ${mode === 'BANNER' ? 'wallet-info__banner' : 'wallet-info__menu'} ${className}`}>
    <img
      src="/wallet-connexion.png"
      width={40}
      height={40}
      alt="displayWallet"
    />
    <span>swapthebestnfts.eth</span>
    { mode === 'BANNER' ? (<IconButton icon="launch" text="" className="icon" />) : null }
    <IconButton icon="logout" text="" className="icon" />
  </div>
);

export default WallelInfo;
