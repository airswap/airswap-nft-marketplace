import React, {
  FC,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { TokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber } from 'bignumber.js';

import Button from '../../../../components/Button/Button';
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
import useApprovalSuccess from '../../../../hooks/useApprovalSuccess';
import useSufficientAllowance from '../../../../hooks/useSufficientAllowance';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { approve } from '../../../../redux/stores/orders/ordersActions';
import { getTitle } from '../../helpers';
import ListActionButtons from '../ListActionButtons/ListActionButtons';
import ListNftWidgetHeader from '../ListNftWidgetHeader/ListNftWidgetHeader';
import SwapIcon from '../SwapIcon/SwapIcon';

import '../../ListNftWidget.scss';

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
  // eslint-disable-next-line @typescript-eslint/no-shadow
  approve = 'approve',
  approving = 'approving',
  sign = 'sign',
  listing = 'listing',
  success = 'success',
  failed = 'failed',
}

interface ListNftWidgetProps {
  chainId: number;
  currencyToken: TokenInfo;
  library: Web3Provider
  className?: string;
}

const ConnectedListNftWidget: FC<ListNftWidgetProps> = ({
  chainId,
  currencyToken,
  library,
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const { isLoading: isLoadingMetadata } = useAppSelector(state => state.metadata);

  // User input states
  const [widgetState, setWidgetState] = useState<ListNftState>(ListNftState.details);
  const [currencyTokenAmount, setCurrencyTokenAmount] = useState('0');

  // States derived from user input
  const hasSufficientCurrencyAllowance = useSufficientAllowance(currencyToken, currencyTokenAmount);
  const hasCurrencyTokenApprovalSuccess = useApprovalSuccess(currencyToken.address);
  const title = useMemo(() => getTitle(widgetState), [widgetState]);

  const handleActionButtonClick = async () => {
    if (widgetState === ListNftState.details) {
      setWidgetState(ListNftState.review);
    }

    if (widgetState === ListNftState.review && !hasSufficientCurrencyAllowance) {
      setWidgetState(ListNftState.approve);

      dispatch(approve({
        token: currencyToken.address,
        library,
        chainId,
      }))
        .unwrap()
        .then(() => {
          setWidgetState(ListNftState.approving);
        })
        .catch(() => {
          setWidgetState(ListNftState.review);
        });
    }
  };

  useEffect(() => {
    if (hasCurrencyTokenApprovalSuccess && widgetState === ListNftState.approving) {
      setWidgetState(ListNftState.review);
    }
  }, [widgetState, hasCurrencyTokenApprovalSuccess]);

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
          {widgetState === ListNftState.details && (
            <>
              <TradeDetails
                title="List"
                token={collectionToken}
              />
              <SwapIcon className="list-nft-widget__swap-icon" />
              <TradeTokenInput
                amountSubtext="Exl. fee 3% = 150 AST"
                token={currencyToken}
                value={currencyTokenAmount}
                onInputChange={setCurrencyTokenAmount}
              />
              <SelectExpiry className="list-nft-widget__select-expiry" />
            </>
          )}

          {(widgetState === ListNftState.review || widgetState === ListNftState.listing || widgetState === ListNftState.success) && (
            <>
              {widgetState === ListNftState.listing && <LoadingSpinner className="list-nft-widget__loading-spinner" />}
              {widgetState === ListNftState.success && <Icon name="check" className="list-nft-widget__check-icon" />}
              <ReviewNftDetails
                title={widgetState === ListNftState.review ? 'List' : 'From'}
                token={collectionToken}
              />
              <SwapIcon className="list-nft-widget__swap-icon" />
              <ReviewTokenDetails
                amount={new BigNumber('5000000000000000000')}
                amountSubtext="5000 AST - Fee's ="
                projectFeePercent={3}
                protocolFeePercent={3}
                title={widgetState === ListNftState.review ? 'For' : 'To'}
                token={currencyToken}
              />
              <ExpiryIndicator
                unit="minutes"
                amount={100}
                className="list-nft-widget__expiry-indicator"
              />
              {widgetState === ListNftState.listing && (
                <TransactionLink
                  to="test"
                  className="list-nft-widget__transaction-link"
                />
              )}
              {widgetState === ListNftState.success && (
                <CopyLinkButton className="list-nft-widget__copy-link-button" />
              )}
            </>
          )}

          {widgetState === ListNftState.approving && (
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

      {(widgetState === ListNftState.sign || widgetState === ListNftState.approve) && (
        <p className="list-nft-widget__message">
          If your wallet does not open something went wrong
        </p>
      )}

      {widgetState === ListNftState.failed && (
        <>
          <Icon name="close" className="list-nft-widget__failed-icon" />
          <p className="list-nft-widget__message">
            Failed for the following reason:
            {/* TODO: Use store value when implemented */}
          </p>
        </>
      )}

      {!(widgetState === ListNftState.sign || widgetState === ListNftState.approve || widgetState === ListNftState.approving) && (
        <ListActionButtons
          state={widgetState}
          hasNotSufficientCollectionAllowance={false}
          hasNotSufficientCurrencyAllowance={!hasSufficientCurrencyAllowance}
          currencyToken={currencyToken}
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

export default ConnectedListNftWidget;
