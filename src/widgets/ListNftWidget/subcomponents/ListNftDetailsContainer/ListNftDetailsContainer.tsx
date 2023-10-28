import React, { FC, useMemo } from 'react';

import { CollectionTokenInfo, FullOrder, TokenInfo } from '@airswap/types';
import { getReceiptUrl } from '@airswap/utils';
import classNames from 'classnames';

import ExpiryIndicator from '../../../../components/ExpiryIndicator/ExpiryIndicator';
import Icon from '../../../../components/Icon/Icon';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import ReviewNftDetails from '../../../../components/ReviewNftDetails/ReviewNftDetails';
import ReviewTokenDetails from '../../../../components/ReviewTokenDetails/ReviewTokenDetails';
import TradeDetails from '../../../../components/TradeDetails/TradeDetails';
import CopyLinkButton from '../../../../compositions/CopyLinkButton/CopyLinkButton';
import SelectExpiry from '../../../../compositions/SelectExpiry/SelectExpiry';
import SelectNftButton from '../../../../compositions/SelectNftButton/SelectNftButton';
import TradeTokenInput from '../../../../compositions/TradeTokenInput/TradeTokenInput';
import TransactionLink from '../../../../compositions/TransactionLink/TransactionLink';
import ConnectedNftSelector from '../../../../connectors/ConnectedNftSelector/ConnectedNftSelector';
import { NftApprovalTransaction } from '../../../../entities/SubmittedTransaction/SubmittedTransaction';
import { AppError } from '../../../../errors/appError';
import writeTextToClipboard from '../../../../helpers/browser';
import { routes } from '../../../../routes';
import { ExpiryTimeUnit } from '../../../../types/ExpiryTimeUnit';
import { ListNftState } from '../ConnectedListNftWidget/ConnectedListNftWidget';
import SwapIcon from '../SwapIcon/SwapIcon';

import './ListNftDetailsContainer.scss';

interface ListNftDetailContainerProps {
  chainId: number;
  collectionImage: string;
  collectionName: string;
  collectionTokenInfo?: CollectionTokenInfo;
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
  selectedTokenId: string;
  submittedApproval?: NftApprovalTransaction;
  userTokens: string[];
  widgetState: ListNftState;
  onExpiryAmountChange: (value?: number) => void;
  onExpiryTimeUnitChange: (value: ExpiryTimeUnit) => void;
  onSelectedNftChange: (tokenId: string) => void;
  onSelectNftButtonClick: () => void;
  onTradeTokenInputChange: (value: string) => void;
  className?: string;
}

const ListNftDetailContainer: FC<ListNftDetailContainerProps> = ({
  chainId,
  collectionImage,
  collectionName,
  collectionTokenInfo,
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
  submittedApproval,
  selectedTokenId,
  widgetState,
  userTokens,
  onExpiryAmountChange,
  onExpiryTimeUnitChange,
  onSelectedNftChange,
  onSelectNftButtonClick,
  onTradeTokenInputChange,
  className = '',
}) => {
  const wrapperClassNames = classNames('list-nft-details-container', {
    [`list-nft-details-container--has-${widgetState}-state`]: widgetState,
  }, className);

  const approvalUrl = useMemo(() => (submittedApproval?.hash ? getReceiptUrl(chainId, submittedApproval.hash) : undefined), [submittedApproval]);

  const handleCopyLinkClick = async () => {
    if (fullOrder) {
      const link = `${window.location.host}/#${routes.orderDetail(fullOrder.signer.wallet, fullOrder.nonce)}`;
      await writeTextToClipboard(link);
    }
  };

  return (
    <div className={wrapperClassNames}>
      {widgetState === ListNftState.details && (
        <>
          <SelectNftButton
            collectionName={collectionName}
            logoURI={collectionTokenInfo?.image}
            title="List"
            token={collectionTokenInfo}
            onClick={onSelectNftButtonClick}
            className="list-nft-details-container__select-nft"
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

      {widgetState === ListNftState.selectNft && (
        <ConnectedNftSelector
          selectedToken={selectedTokenId}
          tokens={userTokens}
          onClickNft={onSelectedNftChange}
        />
      )}

      {(widgetState === ListNftState.review || widgetState === ListNftState.success) && (
        <>
          {widgetState === ListNftState.success && <Icon name="check" className="list-nft-details-container__check-icon" />}
          <ReviewNftDetails
            logoURI={collectionTokenInfo ? collectionTokenInfo.image : collectionImage}
            title={widgetState === ListNftState.review ? 'List' : 'From'}
            token={collectionTokenInfo}
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
          {collectionTokenInfo && (
            <TradeDetails
              logoURI={collectionTokenInfo ? collectionTokenInfo.image : collectionImage}
              title="Approving"
              token={collectionTokenInfo}
            />
          )}
          {approvalUrl && (
            <TransactionLink
              to={approvalUrl}
              className="list-nft-details-container__transaction-link"
            />
          )}
        </>
      )}

      {(widgetState === ListNftState.sign || widgetState === ListNftState.approve) && (
        <p className="list-nft-details-container__message">
          If your wallet does not open something went wrong
        </p>
      )}

      {widgetState === ListNftState.indexing && (
        <LoadingSpinner className="list-nft-details-container__loading-spinner" />
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

      {widgetState === ListNftState.tokenAlreadyListedWarning && (
        <>
          <ReviewNftDetails
            logoURI={collectionTokenInfo ? collectionTokenInfo.image : collectionImage}
            title="Listed"
            token={collectionTokenInfo}
          />
          <div className="list-nft-details-container__warning">
            <Icon
              name="information-circle-outline"
              className="list-nft-details-container__info-icon"
            />
            <div className="list-nft-details-container__warning-text-wrapper">
              <div className="list-nft-details-container__warning-title">
                Token already listed
              </div>
              <div className="list-nft-details-container__warning-text">
                You are about to create a listing for a token that is already listed for sale. It&apos;s possible that the previous listing would fill instead.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ListNftDetailContainer;
