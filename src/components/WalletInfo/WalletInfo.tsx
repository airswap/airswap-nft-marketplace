import { FC } from 'react';

import classNames from 'classnames';

import IconButton from '../../compositions/IconButton/IconButton';

import './WalletInfo.scss';


interface WalletInfoProps {
  isBanner?: boolean
  className?: string
}

const WallelInfo: FC<WalletInfoProps> = ({ isBanner, className = '' }) => {
  const walletInfoClassName = classNames('wallet-info wallet-info--padding', {
    'wallet-info--is-banner': isBanner,
    'wallet-info--is-menu': !isBanner,
  }, className);

  return (
    <div className={walletInfoClassName}>
      <div className="wallet-info__img" />
      <span className="wallet-info__address">swapthebestnfts.eth</span>
      { isBanner ? (<IconButton icon="launch" text="" iconClassName="wallet-info__icon" />) : null }
      <IconButton icon="logout" text="" iconClassName="wallet-info__icon" />
    </div>
  );
};

export default WallelInfo;
