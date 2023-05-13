import React, { FC } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import classNames from 'classnames';

import IconButton from '../../compositions/IconButton/IconButton';
import { truncateAddress } from '../../helpers/stringUtils';
import Avatar from '../Avatar/Avatar';

import './WalletInfo.scss';

interface WalletInfoProps {
  isBanner?: boolean;
  avatarUrl?: string;
  address?: string;
  ensAddress?: string;
  onLogoutButtonClick: () => void;
  className?: string;
  avatarClassName?: string;
}

const WalletInfo: FC<WalletInfoProps> = ({
  isBanner = false,
  avatarUrl = '',
  address = '',
  ensAddress = '',
  onLogoutButtonClick,
  className = '',
  avatarClassName = '',
}) => {
  const walletInfoClassName = classNames('wallet-info', {
    'wallet-info--is-banner': isBanner,
    'wallet-info--is-menu': !isBanner,
  }, className);

  // Check if the supplied ID is the active user
  const { account } = useWeb3React<Web3Provider>();
  const isActiveUser = !address || address === account;

  return (
    <div className={walletInfoClassName}>
      <Avatar className={`wallet-info__avatar ${avatarClassName}`} avatarUrl={avatarUrl} />
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
      {isActiveUser && (
        <IconButton
          hideLabel
          icon="logout"
          text="logout"
          iconClassName="wallet-info__icon"
          onClick={onLogoutButtonClick}
        />
      )}
    </div>
  );
};

export default WalletInfo;
