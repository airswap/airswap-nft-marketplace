import React, { FC, useMemo } from 'react';

import { CollectionTokenInfo, FullOrder, TokenInfo } from '@airswap/types';
import { getReceiptUrl } from '@airswap/utils';
import classNames from 'classnames';

import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import TradeDetails from '../../../../components/TradeDetails/TradeDetails';
import TradeNftDetails, { TradeNftDetailsProps } from '../../../../components/TradeNftDetails/TradeNftDetails';
import TransactionLink from '../../../../compositions/TransactionLink/TransactionLink';
import { getFullOrderSenderAmountPlusTotalFees } from '../../../../entities/FullOrder/FullOrderHelpers';
import { Erc20ApprovalTransaction, OrderTransaction } from '../../../../entities/SubmittedTransaction/SubmittedTransaction';
import { AppError } from '../../../../errors/appError';
import SwapIcon from '../../../ListNftWidget/subcomponents/SwapIcon/SwapIcon';
import { getNftDetailsIcon } from '../../helpers';
import { BuyNftState } from '../ConnectedBuyNftWidget/ConnectedBuyNftWidget';

import './BuyNftWidgetDetailsContainer.scss';

interface BuyNftWidgetDetailsContainerProps {
  chainId: number;
  collectionImage: string;
  collectionName: string;
  collectionTokenInfo: CollectionTokenInfo;
  currencyTokenInfo: TokenInfo;
  error?: AppError;
  fullOrder: FullOrder,
  submittedApproval?: Erc20ApprovalTransaction;
  submittedOrder?: OrderTransaction;
  widgetState: BuyNftState;
  className?: string;
}

const BuyNftWidgetDetailsContainer: FC<BuyNftWidgetDetailsContainerProps> = ({
  chainId,
  collectionImage,
  collectionName,
  collectionTokenInfo,
  currencyTokenInfo,
  error,
  fullOrder,
  submittedApproval,
  submittedOrder,
  widgetState,
  className = '',
}) => {
  const wrapperClassName = classNames('buy-nft-details-container', {
    [`buy-nft-details-container--has-${widgetState}-state`]: widgetState,
  }, className);

  const pricePlusFees = useMemo(() => getFullOrderSenderAmountPlusTotalFees(fullOrder), [fullOrder]);
  const nftDetailsIcon: TradeNftDetailsProps['icon'] = useMemo(() => getNftDetailsIcon(widgetState), [widgetState]);
  const approvalUrl = useMemo(() => (submittedApproval?.hash ? getReceiptUrl(chainId, submittedApproval.hash) : undefined), [submittedApproval]);
  const orderUrl = useMemo(() => (submittedOrder?.hash ? getReceiptUrl(chainId, submittedOrder.hash) : undefined), [submittedOrder]);

  return (
    <div className={wrapperClassName}>
      {(widgetState === BuyNftState.details || widgetState === BuyNftState.success || widgetState === BuyNftState.failed) && (
        <>
          <TradeNftDetails
            icon={nftDetailsIcon}
            collectionImage={collectionImage}
            collectionName={collectionName}
            collectionToken={collectionTokenInfo}
            className="buy-nft-details-container__trade-details"
          />
          {widgetState === BuyNftState.details && (
            <>
              <SwapIcon />
              <TradeDetails
                amount={pricePlusFees}
                logoURI={currencyTokenInfo.logoURI}
                title="For"
                token={currencyTokenInfo}
                className="buy-nft-details-container__trade-details"
              />
            </>
          )}
          {(widgetState === BuyNftState.success && orderUrl) && (
            <TransactionLink
              to={orderUrl}
              className="buy-nft-details-container__transaction-link"
            />
          )}
          {(widgetState === BuyNftState.failed && error) && (
            <p className="buy-nft-details-container__message">
              {/* TODO: Add translations for errors */}
              {`Failed for the following reason: ${error.type}`}
            </p>
          )}
        </>
      )}

      {(widgetState === BuyNftState.sign || widgetState === BuyNftState.approve) && (
        <>
          <LoadingSpinner className="buy-nft-details-container__loading-spinner--is-hidden" />

          <p className="list-nft-details-container__message">
            If your wallet does not open something went wrong
          </p>
        </>
      )}

      {(widgetState === BuyNftState.approving) && (
        <>
          <LoadingSpinner className="buy-nft-details-container__loading-spinner" />
          <TradeDetails
            logoURI={currencyTokenInfo.logoURI}
            title="Approving"
            token={currencyTokenInfo}
          />
          {approvalUrl && (
            <TransactionLink
              to={approvalUrl}
              className="list-nft-details-container__transaction-link"
            />
          )}
        </>
      )}

      {(widgetState === BuyNftState.buying) && (
        <>
          <LoadingSpinner className="buy-nft-details-container__loading-spinner" />
          <TradeDetails
            amount={pricePlusFees}
            logoURI={currencyTokenInfo.logoURI}
            title="For"
            token={currencyTokenInfo}
            className="buy-nft-details-container__trade-details"
          />
          <SwapIcon />
          <TradeDetails
            logoURI={collectionTokenInfo ? collectionTokenInfo.image : collectionImage}
            title="Buy"
            token={collectionTokenInfo}
          />
          {orderUrl && (
            <TransactionLink
              to={orderUrl}
              className="buy-nft-details-container__transaction-link"
            />
          )}
        </>
      )}
    </div>
  );
};

export default BuyNftWidgetDetailsContainer;
