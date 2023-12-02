import React, { FC, useCallback } from 'react';

import { FullOrder, TokenInfo } from '@airswap/types';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';

import Button from '../../../../components/Button/Button';
import { routes } from '../../../../routes';
import { ListNftState } from '../ConnectedListNftWidget/ConnectedListNftWidget';

import './ListActionButtons.scss';

interface ActionButtonsProps {
  hasInsufficientAmount: boolean;
  hasInsufficientExpiryAmount: boolean;
  hasNoCollectionTokenApproval: boolean;
  account: string;
  activeUserOrder?: FullOrder;
  currencyToken: TokenInfo;
  tokenId: string;
  orderNonce?: string;
  state: ListNftState;
  onActionButtonClick: () => void;
  onBackButtonClick: () => void;
  className?: string;
}

const ListActionButtons: FC<ActionButtonsProps> = ({
  hasInsufficientAmount,
  hasInsufficientExpiryAmount,
  hasNoCollectionTokenApproval,
  account,
  activeUserOrder,
  currencyToken,
  tokenId,
  orderNonce,
  state,
  onActionButtonClick,
  onBackButtonClick,
  className = '',
}) => {
  const classNames = classnames('list-action-buttons', {
    'list-action-buttons--is-token-already-listed-warning': state === ListNftState.tokenAlreadyListedWarning,
  }, className);

  const getReviewButtonText = () => {
    if (hasNoCollectionTokenApproval) {
      return 'Approve NFT';
    }

    return 'Sign Listing';
  };

  const getDisabledButtonText = () => {
    if (hasInsufficientExpiryAmount) {
      return 'Fill in expiry';
    }

    return 'Fill in amount';
  };

  const getActionButton = useCallback((): JSX.Element | null => {
    if (hasInsufficientAmount) {
      return (
        <Button
          disabled
          text={getDisabledButtonText()}
          className="list-action-buttons__action-button"
        />
      );
    }

    if (state === ListNftState.details) {
      return (
        <Button
          text="List NFT"
          onClick={onActionButtonClick}
          className="list-action-buttons__action-button"
        />
      );
    }

    if (state === ListNftState.tokenAlreadyListedWarning && activeUserOrder) {
      return (
        <>
          <NavLink
            to={routes.orderDetail(account, activeUserOrder.nonce)}
            className="list-action-buttons__action-button"
          >
            Cancel previous listing
          </NavLink>
          <Button
            text="back"
            onClick={onBackButtonClick}
            className="list-action-buttons__back-button"
          />
          <Button
            text="List anyway"
            onClick={onActionButtonClick}
            className="list-action-buttons__list-anyway-button"
          />
        </>
      );
    }

    if (state === ListNftState.review) {
      return (
        <>
          <Button
            text={getReviewButtonText()}
            onClick={onActionButtonClick}
            className="list-action-buttons__action-button"
          />
          <Button
            text="Back"
            onClick={onBackButtonClick}
            className="list-action-buttons__back-button"
          />
        </>
      );
    }

    if (state === ListNftState.sign) {
      return (
        <NavLink
          to="/"
          className="list-action-buttons__action-button"
        >
          Sign transaction
        </NavLink>
      );
    }

    if (state === ListNftState.success && orderNonce) {
      return (
        <NavLink
          to={routes.userOrders(account, orderNonce)}
          className="list-action-buttons__action-button"
        >
          View listings
        </NavLink>
      );
    }

    if (state === ListNftState.failed) {
      return (
        <NavLink
          to={routes.nftDetail(tokenId)}
          className="list-action-buttons__action-button"
        >
          Go back
        </NavLink>
      );
    }

    return null;
  }, [
    hasInsufficientAmount,
    hasInsufficientExpiryAmount,
    hasNoCollectionTokenApproval,
    currencyToken,
    state,
  ]);

  return (
    <div className={classNames}>
      {getActionButton()}
    </div>
  );
};

export default ListActionButtons;
