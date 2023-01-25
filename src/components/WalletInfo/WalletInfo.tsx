import React, { FC } from 'react';

import classNames from 'classnames';

import IconButton from '../../compositions/IconButton/IconButton';
import { truncateAddress } from '../../helpers/stringUtils';
import Avatar from '../Avatar/Avatar';

import './WalletInfo.scss';

interface WalletInfoProps {
  isBanner?: boolean;
  isMobileMenu?: boolean;
  avatarUrl?: string;
  address?: string;
  ensAddress?: string;
  onDisconnectClick: () => void;
  className?: string;
}

const WalletInfo: FC<WalletInfoProps> = ({
  isBanner = false,
  isMobileMenu = false,
  avatarUrl = '',
  address = '',
  ensAddress = '',
  onDisconnectClick,
  className = '',
}) => {
  const walletInfoClassName = classNames(
    'wallet-info',
    {
      'wallet-info--is-banner': isBanner,
      'wallet-info--is-menu': !isBanner,
    },
    className,
  );

  return (
    <div className={walletInfoClassName}>
      {isMobileMenu && <Avatar className="wallet-info__avatar" avatarUrl={avatarUrl} />}
      <div className="wallet-info__address-bar">
        <span className="wallet-info__address">{truncateAddress(ensAddress || address)}</span>
        {ensAddress && <span className="wallet-info__address-secondary">{truncateAddress(address)}</span>}
      </div>
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
        onClick={onDisconnectClick}
      />
    </div>
  );
};

export default WalletInfo;
