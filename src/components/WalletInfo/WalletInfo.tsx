import { FC } from 'react';

import classNames from 'classnames';

import IconButton from '../../compositions/IconButton/IconButton';
import Avatar from '../Avatar/Avatar';

import './WalletInfo.scss';


interface WalletInfoProps {
  isBanner?: boolean;
  avatarUrl?: string;
  address?: string;
  className?: string
}

const WalletInfo: FC<WalletInfoProps> = ({
  isBanner = false,
  avatarUrl = '',
  address = '',
  className = '',
}) => {
  const walletInfoClassName = classNames('wallet-info', {
    'wallet-info--is-banner': isBanner,
    'wallet-info--is-menu': !isBanner,
  }, className);

  return (
    <div className={walletInfoClassName}>
      <Avatar className="wallet-info__avatar" avatarUrl={avatarUrl} />
      <span className="wallet-info__address">{address}</span>
      {isBanner && (
        <IconButton
          hideLabel
          icon="launch"
          text="wallet"
          iconClassName="wallet-info__icon"
        />
      )}
      <IconButton
        hideLabel
        icon="logout"
        text="logout"
        iconClassName="wallet-info__icon"
      />
    </div>
  );
};

export default WalletInfo;
