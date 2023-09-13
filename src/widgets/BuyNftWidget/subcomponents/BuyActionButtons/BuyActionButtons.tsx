import React, { FC, useCallback } from 'react';

import { CollectionTokenInfo } from '@airswap/types';
import { NavLink } from 'react-router-dom';

import Button from '../../../../components/Button/Button';
import { routes } from '../../../../routes';
import { BuyNftState } from '../ConnectedBuyNftWidget/ConnectedBuyNftWidget';

import './BuyActionButtons.scss';

interface ActionButtonsProps {
  hasInsufficientAmount: boolean;
  hasNoCurrencyTokenApproval: boolean;
  isOrderExpired: boolean;
  isOrderNonceUsed: boolean;
  ownerIsAccount: boolean;
  account: string;
  collectionTokenInfo: CollectionTokenInfo;
  currencyTokenSymbol: string;
  state: BuyNftState;
  onActionButtonClick: () => void;
  className?: string;
}

const BuyActionButtons: FC<ActionButtonsProps> = ({
  hasInsufficientAmount,
  hasNoCurrencyTokenApproval,
  isOrderExpired,
  isOrderNonceUsed,
  ownerIsAccount,
  account,
  collectionTokenInfo,
  currencyTokenSymbol,
  state,
  onActionButtonClick,
  className = '',
}) => {
  const getActionButton = useCallback((): JSX.Element | null => {
    if (ownerIsAccount) {
      return (
        <Button
          disabled
          text="This is your own order"
          className="buy-action-buttons__action-button"
        />
      );
    }

    if (isOrderNonceUsed && state === BuyNftState.details) {
      return (
        <Button
          disabled
          text="Order is already taken"
          className="buy-action-buttons__action-button"
        />
      );
    }

    if (isOrderExpired && state === BuyNftState.details) {
      return (
        <Button
          disabled
          text="Order is expired"
          className="buy-action-buttons__action-button"
        />
      );
    }

    if (hasInsufficientAmount && state === BuyNftState.details) {
      return (
        <Button
          disabled
          text={`Insufficient ${currencyTokenSymbol}`}
          className="buy-action-buttons__action-button"
        />
      );
    }

    if (state === BuyNftState.details) {
      return (
        <Button
          text={hasNoCurrencyTokenApproval ? `Approve ${currencyTokenSymbol}` : 'Buy NFT'}
          onClick={onActionButtonClick}
          className="buy-action-buttons__action-button"
        />
      );
    }

    if (state === BuyNftState.buying) {
      return (
        <NavLink
          to="/"
          className="buy-action-buttons__action-button"
        >
          Back to collection
        </NavLink>
      );
    }

    if (state === BuyNftState.success) {
      return (
        <NavLink
          to={routes.profile(account)}
          className="buy-action-buttons__action-button"
        >
          View in my profile
        </NavLink>
      );
    }

    if (state === BuyNftState.failed) {
      return (
        <NavLink
          to={routes.nftDetail(collectionTokenInfo.id.toString())}
          onClick={onActionButtonClick}
          className="buy-action-buttons__action-button"
        >
          Go back
        </NavLink>
      );
    }

    return null;
  }, [
    hasInsufficientAmount,
    hasNoCurrencyTokenApproval,
    isOrderExpired,
    isOrderNonceUsed,
    ownerIsAccount,
    account,
    collectionTokenInfo,
    currencyTokenSymbol,
    state,
  ]);

  return (
    <div className={`buy-action-buttons ${className}`}>
      {getActionButton()}
    </div>
  );
};

export default BuyActionButtons;
