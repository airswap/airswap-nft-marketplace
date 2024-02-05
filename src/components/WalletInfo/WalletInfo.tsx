import React, { FC } from 'react';

import classNames from 'classnames';

import IconButton from '../../compositions/IconButton/IconButton';
import { truncateAddress } from '../../helpers/string';
import Avatar from '../Avatar/Avatar';
import Icon from '../Icon/Icon';

import './WalletInfo.scss';

interface WalletInfoProps {
  isBanner?: boolean;
  showLogOutButton?: boolean;
  accountUrl?: string;
  address?: string;
  avatarUrl?: string;
  ensAddress?: string;
  onLogoutButtonClick?: () => void;
  className?: string;
  avatarClassName?: string;
}

const WalletInfo: FC<WalletInfoProps> = ({
  isBanner = false,
  showLogOutButton,
  accountUrl,
  address = '',
  avatarUrl = '',
  ensAddress = '',
  onLogoutButtonClick,
  className = '',
  avatarClassName = '',
}) => {
  const walletInfoClassName = classNames('wallet-info', {
    'wallet-info--is-menu': !isBanner,
  }, className);

  return (
    <div className={walletInfoClassName}>
      <Avatar className={`wallet-info__avatar ${avatarClassName}`} avatarUrl={avatarUrl} />
      <div className="wallet-info__address-bar">
        <h2 className="wallet-info__sub-title">Wallet</h2>
        <span className="wallet-info__address">{truncateAddress(ensAddress || address)}</span>
        {ensAddress && <span className="wallet-info__address-secondary">{truncateAddress(address)}</span>}
      </div>
      {accountUrl && (
        <a
          aria-label="address"
          href={accountUrl}
          rel="noreferrer"
          target="_blank"
          className="wallet-info__link"
        >
          <Icon
            name="launch"
            className="wallet-info__icon"
          />
        </a>
      )}
      {showLogOutButton && (
        <IconButton
          hideLabel
          icon="logout"
          text="logout"
          onClick={onLogoutButtonClick}
          iconClassName="wallet-info__icon"
          className="wallet-info__button"
        />
      )}
    </div>
  );
};

export default WalletInfo;
