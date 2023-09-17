import React, { FC, ReactElement, useCallback } from 'react';

import { NavLink } from 'react-router-dom';

import Button from '../../../../components/Button/Button';
import { routes } from '../../../../routes';
import { CancelOrderState } from '../ConnectedCancelOrderWidget/ConnectedCancelOrderWidget';

import './CancelActionButtons.scss';

interface CancelActionButtonsProps {
  nftId: string;
  state: CancelOrderState;
  onActionButtonClick: () => void;
  className?: string;
}

const CancelActionButtons: FC<CancelActionButtonsProps> = ({
  nftId,
  state,
  onActionButtonClick,
  className = '',
}): ReactElement => {
  const getActionButton = useCallback((): JSX.Element | null => {
    if (state === CancelOrderState.details) {
      return (
        <Button
          text="Cancel listing"
          onClick={onActionButtonClick}
          className="cancel-action-buttons__cancel-button"
        />
      );
    }

    if (state === CancelOrderState.success) {
      return (
        <>
          <NavLink
            to={routes.nftDetail(nftId)}
            className="cancel-action-buttons__back-button"
          >
            Back
          </NavLink>
          <NavLink
            to={routes.listNft(nftId)}
            className="cancel-action-buttons__action-button"
          >
            Re-list NFT
          </NavLink>
        </>
      );
    }

    if (state === CancelOrderState.failed) {
      return (
        <>
          <NavLink
            to={routes.nftDetail(nftId)}
            className="cancel-action-buttons__back-button"
          >
            Back
          </NavLink>
          <Button
            text="Try again"
            onClick={onActionButtonClick}
            className="cancel-action-buttons__action-button"
          />
        </>
      );
    }

    return null;
  }, [state]);

  return (
    <div className={`cancel-action-buttons ${className}`}>
      {getActionButton()}
    </div>
  );
};

export default CancelActionButtons;
