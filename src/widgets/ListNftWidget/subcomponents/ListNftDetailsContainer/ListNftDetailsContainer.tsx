import React, { FC } from 'react';

import { FullOrder, TokenInfo } from '@airswap/types';
import classNames from 'classnames';

import ExpiryIndicator from '../../../../components/ExpiryIndicator/ExpiryIndicator';
import Icon from '../../../../components/Icon/Icon';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import ReviewNftDetails from '../../../../components/ReviewNftDetails/ReviewNftDetails';
import ReviewTokenDetails from '../../../../components/ReviewTokenDetails/ReviewTokenDetails';
import TradeDetails from '../../../../components/TradeDetails/TradeDetails';
import CopyLinkButton from '../../../../compositions/CopyLinkButton/CopyLinkButton';
import SelectExpiry from '../../../../compositions/SelectExpiry/SelectExpiry';
import TradeTokenInput from '../../../../compositions/TradeTokenInput/TradeTokenInput';
import TransactionLink from '../../../../compositions/TransactionLink/TransactionLink';
import { CollectionToken } from '../../../../entities/CollectionToken/CollectionToken';
import { AppError } from '../../../../errors/appError';
import writeTextToClipboard from '../../../../helpers/browser';
import { AppRoutes } from '../../../../routes';
import { ExpiryTimeUnit } from '../../../../types/ExpiryTimeUnit';
import { ListNftState } from '../ConnectedListNftWidget/ConnectedListNftWidget';
import SwapIcon from '../SwapIcon/SwapIcon';

import './ListNftDetailsContainer.scss';

interface ListNftDetailContainerProps {
  collectionImage: string;
  collectionTokenInfo: TokenInfo;
  collectionToken?: CollectionToken;
  currencyTokenAmount: string;
  currencyTokenAmountMinusProtocolFee?: string;
  currencyTokenInfo: TokenInfo;
  error?: AppError;
  expiryAmount?: number;
  expiryTimeUnit: ExpiryTimeUnit;
  fullOrder?: FullOrder,
  projectFee: number;
  protocolFeeInCurrencyToken?: string;
  protocolFee: number;
  tokenId: number;
  widgetState: ListNftState;
  onExpiryAmountChange: (value?: number) => void;
  onExpiryTimeUnitChange: (value: ExpiryTimeUnit) => void;
  onTradeTokenInputChange: (value: string) => void;
  className?: string;
}

const ListNftDetailContainer: FC<ListNftDetailContainerProps> = ({
  collectionImage,
  collectionTokenInfo,
  collectionToken,
  currencyTokenInfo,
  currencyTokenAmount,
  currencyTokenAmountMinusProtocolFee,
  error,
  expiryAmount,
  expiryTimeUnit,
  fullOrder,
  projectFee,
  protocolFeeInCurrencyToken,
  protocolFee,
  tokenId,
  widgetState,
  onExpiryAmountChange,
  onExpiryTimeUnitChange,
  onTradeTokenInputChange,
  className = '',
}) => {
  const wrapperClassNames = classNames('list-nft-details-container', {
    [`list-nft-details-container--has-${widgetState}-state`]: widgetState,
  }, className);

  const handleCopyLinkClick = async () => {
    const link = `${window.location.host}/#/${AppRoutes.nftDetail}/${fullOrder?.signer.id}/buy`;
    await writeTextToClipboard(link);
  };

  return (
    <div className={wrapperClassNames}>
      {widgetState === ListNftState.details && (
        <>
          <TradeDetails
            logoURI={collectionToken ? collectionToken.image : collectionImage}
            title="List"
            token={collectionTokenInfo}
          />
          <SwapIcon className="list-nft-details-container__swap-icon" />
          <TradeTokenInput
            protocolFeeInCurrencyToken={protocolFeeInCurrencyToken}
            protocolFeePercent={protocolFee / 100}
            token={currencyTokenInfo}
            value={currencyTokenAmount}
            onInputChange={onTradeTokenInputChange}
          />
          <SelectExpiry
            amount={expiryAmount}
            timeUnit={expiryTimeUnit}
            onAmountChange={onExpiryAmountChange}
            onTimeUnitChange={onExpiryTimeUnitChange}
            className="list-nft-details-container__select-expiry"
          />
        </>
      )}

      {(widgetState === ListNftState.review || widgetState === ListNftState.listing || widgetState === ListNftState.success) && (
        <>
          {widgetState === ListNftState.listing && <LoadingSpinner className="list-nft-details-container__loading-spinner" />}
          {widgetState === ListNftState.success && <Icon name="check" className="list-nft-details-container__check-icon" />}
          <ReviewNftDetails
            logoURI={collectionToken ? collectionToken.image : collectionImage}
            title={widgetState === ListNftState.review ? 'List' : 'From'}
            token={collectionTokenInfo}
            tokenId={tokenId}
          />
          <SwapIcon className="list-nft-details-container__swap-icon" />
          <ReviewTokenDetails
            amount={currencyTokenAmount}
            amountMinusProtocolFee={currencyTokenAmountMinusProtocolFee}
            projectFeePercent={projectFee / 100}
            protocolFeePercent={protocolFee / 100}
            title={widgetState === ListNftState.review ? 'For' : 'To'}
            token={currencyTokenInfo}
          />
          <ExpiryIndicator
            unit={expiryTimeUnit}
            amount={expiryAmount}
            className="list-nft-details-container__expiry-indicator"
          />
          {widgetState === ListNftState.listing && (
            <TransactionLink
              to="test"
              className="list-nft-details-container__transaction-link"
            />
          )}
          {widgetState === ListNftState.success && (
            <CopyLinkButton
              onClick={handleCopyLinkClick}
              className="list-nft-details-container__copy-link-button"
            />
          )}
        </>
      )}

      {widgetState === ListNftState.approving && (
        <>
          <LoadingSpinner className="list-nft-details-container__loading-spinner" />
          <TradeDetails
            logoURI={collectionToken ? collectionToken.image : collectionImage}
            title="Approving"
            token={collectionTokenInfo}
          />
          <TransactionLink
            to="test"
            className="list-nft-details-container__transaction-link"
          />
        </>
      )}

      {(widgetState === ListNftState.sign || widgetState === ListNftState.approve) && (
        <p className="list-nft-details-container__message">
          If your wallet does not open something went wrong
        </p>
      )}

      {widgetState === ListNftState.failed && (
        <>
          <Icon name="close" className="list-nft-details-container__failed-icon" />
          <p className="list-nft-details-container__message">
            {/* TODO: Add translations for errors */}
            {`Failed for the following reason: ${error?.type}`}
          </p>
        </>
      )}
    </div>
  );
};

export default ListNftDetailContainer;
