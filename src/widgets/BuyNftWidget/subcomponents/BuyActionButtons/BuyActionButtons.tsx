import React, { FC, useCallback } from 'react';

import { NavLink } from 'react-router-dom';

import Button from '../../../../components/Button/Button';
import { AppRoutes } from '../../../../routes';
import { BuyNftState } from '../../BuyNftWidget';

import './BuyActionButtons.scss';

interface ActionButtonsProps {
  state: BuyNftState;
  onActionButtonClick: () => void;
  className?: string;
}

const BuyActionButtons: FC<ActionButtonsProps> = ({ state, onActionButtonClick, className = '' }) => {
  const getActionButton = useCallback((): JSX.Element | null => {
    if (state === BuyNftState.details) {
      return (
        <Button
          text="Buy NFT"
          onClick={onActionButtonClick}
          className="buy-action-buttons__action-button"
        />
      );
    }

    if (state === BuyNftState.pending) {
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
          to={`/${AppRoutes.profile}`}
          className="buy-action-buttons__action-button"
        >
          View in my profile
        </NavLink>
      );
    }

    if (state === BuyNftState.failed) {
      return (
        <NavLink
          to={`/${AppRoutes.nftDetail}/1`}
          className="buy-action-buttons__action-button"
        >
          Go back
        </NavLink>
      );
    }

    return null;
  }, [state]);

  return (
    <div className={`buy-action-buttons ${className}`}>
      {getActionButton()}
    </div>
  );
};

export default BuyActionButtons;
