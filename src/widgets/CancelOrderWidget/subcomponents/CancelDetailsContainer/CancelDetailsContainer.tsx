import React, { FC, ReactElement, useMemo } from 'react';

import {
  CollectionTokenInfo,
  FullOrder,
  getReceiptUrl,
  TokenInfo,
} from '@airswap/utils';
import classNames from 'classnames';

import ExpiryDateInfo from '../../../../components/ExpiryDateInfo/ExpiryDateInfo';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import ReviewNftDetails from '../../../../components/ReviewNftDetails/ReviewNftDetails';
import ReviewTokenDetails from '../../../../components/ReviewTokenDetails/ReviewTokenDetails';
import TradeDetails from '../../../../components/TradeDetails/TradeDetails';
import TransactionLink from '../../../../compositions/TransactionLink/TransactionLink';
import {
  getFullOrderExpiryDate,
  getFullOrderReadableSenderAmount,
  getFullOrderReadableSenderAmountPlusTotalFees,
} from '../../../../entities/FullOrder/FullOrderHelpers';
import { SubmittedTransaction } from '../../../../entities/SubmittedTransaction/SubmittedTransaction';
import SwapIcon from '../../../ListNftWidget/subcomponents/SwapIcon/SwapIcon';
import { CancelOrderState } from '../ConnectedCancelOrderWidget/ConnectedCancelOrderWidget';

import './CancelDetailsContainer.scss';

interface CancelDetailsContainerProps {
  chainId: number;
  collectionImage: string;
  collectionTokenInfo: CollectionTokenInfo;
  currencyTokenInfo: TokenInfo;
  fullOrder: FullOrder;
  projectFee: number;
  protocolFee: number;
  submittedTransaction?: SubmittedTransaction;
  widgetState: CancelOrderState;
  className?: string;
}

const CancelDetailsContainer: FC<CancelDetailsContainerProps> = ({
  chainId,
  collectionImage,
  collectionTokenInfo,
  currencyTokenInfo,
  fullOrder,
  projectFee,
  protocolFee,
  submittedTransaction,
  widgetState,
  className = '',
}): ReactElement => {
  const wrapperClassName = classNames('cancel-details-container', {
    [`cancel-details-container--has-${widgetState}-state`]: widgetState,
  }, className);

  const transactionUrl = useMemo(() => (submittedTransaction?.hash ? getReceiptUrl(chainId, submittedTransaction.hash) : undefined), [submittedTransaction]);
  const expiryDate = useMemo(() => getFullOrderExpiryDate(fullOrder), [fullOrder]);
  const readableSenderAmountPlusFees = useMemo(() => getFullOrderReadableSenderAmountPlusTotalFees(fullOrder, currencyTokenInfo), [fullOrder, currencyTokenInfo]);
  const readableSenderAmount = useMemo(() => getFullOrderReadableSenderAmount(fullOrder, currencyTokenInfo), [fullOrder, currencyTokenInfo]);

  return (
    <div className={wrapperClassName}>
      {widgetState === CancelOrderState.details && (
        <>
          <ReviewNftDetails
            logoURI={collectionTokenInfo ? collectionTokenInfo.image : collectionImage}
            title="Cancel"
            token={collectionTokenInfo}
            className="cancel-details-container__review-nft-details"
          />
          <SwapIcon className="cancel-details-container__swap-icon" />
          <ReviewTokenDetails
            amount={readableSenderAmountPlusFees}
            amountMinusProtocolFee={readableSenderAmount}
            projectFeePercent={projectFee / 100}
            protocolFeePercent={protocolFee / 100}
            title="For"
            token={currencyTokenInfo}
          />
          <ExpiryDateInfo
            expiry={expiryDate}
            className="cancel-details-container__expiry-date-info"
          />
        </>
      )}

      {widgetState === CancelOrderState.sign && (
        <p className="cancel-details-container__message">
          If your wallet does not open something went wrong
        </p>
      )}

      {widgetState === CancelOrderState.canceling && (
        <>
          <LoadingSpinner className="cancel-details-container__loading-spinner" />
          <TradeDetails
            logoURI={collectionTokenInfo ? collectionTokenInfo.image : collectionImage}
            title="Canceling"
            token={collectionTokenInfo}
          />
          {transactionUrl && (
            <TransactionLink
              to={transactionUrl}
              className="cancel-details-container__transaction-link"
            />
          )}
        </>
      )}

      {(widgetState === CancelOrderState.success || widgetState === CancelOrderState.failed) && (
        <>
          <LoadingSpinner className="cancel-details-container__loading-spinner--is-hidden" />
          <TradeDetails
            logoURI={collectionTokenInfo ? collectionTokenInfo.image : collectionImage}
            title={widgetState === CancelOrderState.success ? 'Canceled' : 'Failed transaction'}
            token={collectionTokenInfo}
          />
          {transactionUrl && (
            <TransactionLink
              to={transactionUrl}
              className="cancel-details-container__transaction-link"
            />
          )}
        </>
      )}
    </div>
  );
};

export default CancelDetailsContainer;
