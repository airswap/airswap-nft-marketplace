import React, {
  FC,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { TokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';

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
import { transformNFTTokenToCollectionToken } from '../../../../entities/CollectionToken/CollectionTokenTransformers';
import useErc20ApprovalSuccess from '../../../../hooks/useErc20ApprovalSuccess';
import useInsufficientAmount from '../../../../hooks/useInsufficientAmount';
import useInsufficientBalance from '../../../../hooks/useInsufficientBalance';
import useNftTokenApproval from '../../../../hooks/useNftTokenApproval';
import useSufficientErc20Allowance from '../../../../hooks/useSufficientErc20Allowance';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { approve } from '../../../../redux/stores/orders/ordersActions';
import { ExpiryTimeUnit } from '../../../../types/ExpiryTimeUnit';
import { getTitle } from '../../helpers';
import useTokenAmountAndFee from '../../hooks/useTokenAmountAndFee';
import ListActionButtons from '../ListActionButtons/ListActionButtons';
import ListNftWidgetHeader from '../ListNftWidgetHeader/ListNftWidgetHeader';
import SwapIcon from '../SwapIcon/SwapIcon';

import '../../ListNftWidget.scss';

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
  collectionTokenInfo: TokenInfo;
  currencyTokenInfo: TokenInfo;
  library: Web3Provider
  className?: string;
}

const ConnectedListNftWidget: FC<ListNftWidgetProps> = ({
  chainId,
  collectionTokenInfo,
  currencyTokenInfo,
  library,
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const { collectionImage } = useAppSelector(state => state.config);
  const { isLoading: isLoadingMetadata, protocolFee, projectFee } = useAppSelector(state => state.metadata);

  // User input states
  const [widgetState, setWidgetState] = useState<ListNftState>(ListNftState.details);
  // TODO: Get tokenId from owned nfts in store https://github.com/airswap/airswap-marketplace/issues/62
  const tokenId = 78426;
  const collectionToken = transformNFTTokenToCollectionToken(collectionTokenInfo, tokenId, '1');
  const [currencyTokenAmount, setCurrencyTokenAmount] = useState('0');
  const [expiryTimeUnit, setExpiryTimeUnit] = useState(ExpiryTimeUnit.minutes);
  const [expiryAmount, setExpiryAmount] = useState<number | undefined>(60);

  // States derived from user input
  const [currencyTokenAmountMinusProtocolFee, protocolFeeInCurrencyToken] = useTokenAmountAndFee(currencyTokenAmount);
  const hasSufficientCurrencyAllowance = useSufficientErc20Allowance(currencyTokenInfo, currencyTokenAmount);
  const hasSufficientBalance = !useInsufficientBalance(currencyTokenInfo, currencyTokenAmount);
  const hasInsufficientAmount = useInsufficientAmount(currencyTokenAmount);
  const hasInsufficientExpiryAmount = !expiryAmount || expiryAmount < 0;
  const hasCollectionTokenApproval = useNftTokenApproval(collectionTokenInfo, tokenId);
  const hasCurrencyTokenApprovalSuccess = useErc20ApprovalSuccess(currencyTokenInfo.address);

  const title = useMemo(() => getTitle(widgetState), [widgetState]);

  const handleActionButtonClick = async () => {
    if (widgetState === ListNftState.details) {
      setWidgetState(ListNftState.review);
    }

    if (widgetState === ListNftState.review && (!hasSufficientCurrencyAllowance || !hasCollectionTokenApproval)) {
      setWidgetState(ListNftState.approve);
      const tokenInfo = !hasSufficientCurrencyAllowance ? currencyTokenInfo : collectionTokenInfo;

      dispatch(approve({
        tokenInfo,
        library,
        chainId,
        tokenId,
      }))
        .unwrap()
        .then(() => {
          setWidgetState(ListNftState.approving);
        })
        .catch(() => {
          setWidgetState(ListNftState.review);
        });
    }

    if (widgetState === ListNftState.review) {
      // TODO: Dispatch make order
    }
  };

  useEffect(() => {
    if (hasCurrencyTokenApprovalSuccess && widgetState === ListNftState.approving) {
      setWidgetState(ListNftState.review);
    }
  }, [widgetState, hasCurrencyTokenApprovalSuccess]);

  useEffect(() => {
    if (hasCollectionTokenApproval && widgetState === ListNftState.approving) {
      setWidgetState(ListNftState.review);
    }
  }, [widgetState, hasCollectionTokenApproval]);

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

      <div className="list-nft-widget__trade-details-container">
        {widgetState === ListNftState.details && (
          <>
            <TradeDetails
              logoURI={collectionToken ? collectionToken.image : collectionImage}
              title="List"
              token={collectionTokenInfo}
            />
            <SwapIcon className="list-nft-widget__swap-icon" />
            <TradeTokenInput
              protocolFeeInCurrencyToken={protocolFeeInCurrencyToken}
              protocolFeePercent={protocolFee / 100}
              token={currencyTokenInfo}
              value={currencyTokenAmount}
              onInputChange={setCurrencyTokenAmount}
            />
            <SelectExpiry
              amount={expiryAmount}
              timeUnit={expiryTimeUnit}
              onAmountChange={setExpiryAmount}
              onTimeUnitChange={setExpiryTimeUnit}
              className="list-nft-widget__select-expiry"
            />
          </>
        )}

        {(widgetState === ListNftState.review || widgetState === ListNftState.listing || widgetState === ListNftState.success) && (
          <>
            {widgetState === ListNftState.listing && <LoadingSpinner className="list-nft-widget__loading-spinner" />}
            {widgetState === ListNftState.success && <Icon name="check" className="list-nft-widget__check-icon" />}
            <ReviewNftDetails
              logoURI={collectionToken ? collectionToken.image : collectionImage}
              title={widgetState === ListNftState.review ? 'List' : 'From'}
              token={collectionTokenInfo}
              tokenId={tokenId}
            />
            <SwapIcon className="list-nft-widget__swap-icon" />
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
            {hasSufficientCurrencyAllowance ? (
              <TradeDetails
                logoURI={currencyTokenInfo.logoURI}
                title="Approving"
                token={currencyTokenInfo}
              />
            ) : (
              <TradeDetails
                logoURI={collectionToken ? collectionToken.image : collectionImage}
                title="Approving"
                token={collectionTokenInfo}
              />
            )}
            <TransactionLink
              to="test"
              className="list-nft-widget__transaction-link"
            />
          </>
        )}
      </div>

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
          hasNoCollectionTokenApproval={!hasCollectionTokenApproval}
          hasNotSufficientCurrencyAllowance={!hasSufficientCurrencyAllowance}
          hasInsufficientAmount={hasInsufficientAmount}
          hasInsufficientBalance={!hasSufficientBalance}
          hasInsufficientExpiryAmount={hasInsufficientExpiryAmount}
          currencyToken={currencyTokenInfo}
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
