import React, { FC, useMemo, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import Button from '../../components/Button/Button';
import ExpiryIndicator from '../../components/ExpiryIndicator/ExpiryIndicator';
import Icon from '../../components/Icon/Icon';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ReviewNftDetails from '../../components/ReviewNftDetails/ReviewNftDetails';
import ReviewTokenDetails from '../../components/ReviewTokenDetails/ReviewTokenDetails';
import TradeDetails from '../../components/TradeDetails/TradeDetails';
import CopyLinkButton from '../../compositions/CopyLinkButton/CopyLinkButton';
import SelectExpiry from '../../compositions/SelectExpiry/SelectExpiry';
import TransactionLink from '../../compositions/TransactionLink/TransactionLink';
import { CollectionToken } from '../../entities/CollectionToken/CollectionToken';
import { useAppSelector } from '../../redux/hooks';
import { selectCurrencyTokenInfo } from '../../redux/stores/metadata/metadataSlice';
import { getTitle } from './helpers';
import ListActionButtons from './subcomponents/ListActionButtons/ListActionButtons';
import ListNftWidgetHeader from './subcomponents/ListNftWidgetHeader/ListNftWidgetHeader';
import SwapIcon from './subcomponents/SwapIcon/SwapIcon';

import './ListNftWidget.scss';

const collectionToken: CollectionToken = {
  id: 1,
  name: 'Dummy Snavie Hop',
  image: 'collection/collection-example-image.png',
  description: 'Heh',
  price: '1',
  attributes: [],
  symbol: 'AST',
  createdBy: 'Sjnivo',
  externalUrl: 'www.snavie.com',
};

// TODO: Move ListNftState to store when it's made
export enum ListNftState {
  details = 'details',
  review = 'review',
  approve = 'approve',
  approving = 'approving',
  sign = 'sign',
  listing = 'listing',
  success = 'success',
  failed = 'failed',
}

// TODO: This is for testing, please ignore
let stepCount = 0;
const steps: ListNftState[] = [
  ListNftState.details,
  ListNftState.review,
  ListNftState.approve,
  ListNftState.approving,
  ListNftState.review,
  ListNftState.sign,
  ListNftState.listing,
  ListNftState.success,
  ListNftState.failed,
];

interface ListNftWidgetProps {
  className?: string;
}

const ListNftWidget: FC<ListNftWidgetProps> = ({ className = '' }) => {
  const { isLoading: isLoadingMetadata } = useAppSelector(state => state.metadata);
  // const { collectionImage, collectionName } = useAppSelector(state => state.config);
  // const collectionToken = useAppSelector(selectCollectionTokenInfo);
  const currencyToken = useAppSelector(selectCurrencyTokenInfo);

  const [state, setState] = useState<ListNftState>(ListNftState.details);

  const title = useMemo(() => getTitle(state), [state]);

  const handleActionButtonClick = () => {
    // TODO: This is for testing, please ignore
    stepCount = stepCount === steps.length - 1 ? 0 : stepCount += 1;

    setState(steps[stepCount]);
  };

  if (isLoadingMetadata) {
    return (
      <div className={`list-nft-widget ${className}`}>
        <h1>List NFT</h1>
        <LoadingSpinner className="list-nft-widget__loading-spinner" />
      </div>
    );
  }

  return (
    <div className={`list-nft-widget ${className}`}>
      <ListNftWidgetHeader
        title={title}
        className="list-nft-widget__header"
      />

      {(collectionToken && currencyToken) && (
        <div className="list-nft-widget__trade-details-container">
          {state === ListNftState.details && (
            <>
              <TradeDetails
                title="List"
                token={collectionToken}
              />
              <SwapIcon className="list-nft-widget__swap-icon" />
              <TradeDetails
                amount={new BigNumber('5000000000000000000')}
                amountSubtext="Exl. fee 3% = 150 AST"
                title="For"
                token={currencyToken}
              />
              <SelectExpiry className="list-nft-widget__select-expiry" />
            </>
          )}

          {(state === ListNftState.review || state === ListNftState.listing || state === ListNftState.success) && (
            <>
              {state === ListNftState.listing && <LoadingSpinner className="list-nft-widget__loading-spinner" />}
              {state === ListNftState.success && <Icon name="check" className="list-nft-widget__check-icon" />}
              <ReviewNftDetails
                title={state === ListNftState.review ? 'List' : 'From'}
                token={collectionToken}
              />
              <SwapIcon className="list-nft-widget__swap-icon" />
              <ReviewTokenDetails
                amount={new BigNumber('5000000000000000000')}
                amountSubtext="5000 AST - Fee's ="
                projectFeePercent={3}
                protocolFeePercent={3}
                title={state === ListNftState.review ? 'For' : 'To'}
                token={currencyToken}
              />
              <ExpiryIndicator
                unit="minutes"
                amount={100}
                className="list-nft-widget__expiry-indicator"
              />
              {state === ListNftState.listing && (
                <TransactionLink
                  to="test"
                  className="list-nft-widget__transaction-link"
                />
              )}
              {state === ListNftState.success && (
                <CopyLinkButton className="list-nft-widget__copy-link-button" />
              )}
            </>
          )}

          {state === ListNftState.approving && (
            <>
              <LoadingSpinner className="list-nft-widget__loading-spinner" />
              <TradeDetails
                title="Approving"
                token={collectionToken}
              />
              <TransactionLink
                to="test"
                className="list-nft-widget__transaction-link"
              />
            </>
          )}
        </div>
      )}

      {(state === ListNftState.sign || state === ListNftState.approve) && (
        <p className="list-nft-widget__message">
          If your wallet does not open something went wrong
        </p>
      )}

      {state === ListNftState.failed && (
        <>
          <Icon name="close" className="list-nft-widget__failed-icon" />
          <p className="list-nft-widget__message">
            Failed for the following reason:
            {/* TODO: Use store value when implemented */}
          </p>
        </>
      )}

      {!(state === ListNftState.sign || state === ListNftState.approve || state === ListNftState.approving) && (
        <ListActionButtons
          state={state}
          onActionButtonClick={handleActionButtonClick}
          className="list-nft-widget__action-buttons"
        />
      )}

      <Button
        text="Invisible dummy button (for testing only)"
        onClick={handleActionButtonClick}
        className="list-nft-widget__dummy-button"
      />
    </div>
  );
};

export default ListNftWidget;
