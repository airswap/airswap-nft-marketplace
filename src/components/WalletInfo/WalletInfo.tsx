import { FC } from 'react';

import IconButton from '../../compositions/IconButton/IconButton';

import './WalletInfo.scss';


interface WalletInfoProps {
  isBanner?: boolean
  className?: string
}

const WallelInfo: FC<WalletInfoProps> = ({ isBanner, className = '' }) => (
  <div className={`wallet-info wallet-info--padding ${isBanner ? 'wallet-info--is-banner' : 'wallet-info--is-menu'} ${className}`}>
    <img
      src="/wallet-connexion.png"
      width={40}
      height={40}
      alt="displayWallet"
    />
    <span>swapthebestnfts.eth</span>
    { isBanner ? (<IconButton icon="launch" text="" iconClassName="wallet-info__icon" />) : null }
    <IconButton icon="logout" text="" iconClassName="wallet-info__icon" />
  </div>
);

export default WallelInfo;
