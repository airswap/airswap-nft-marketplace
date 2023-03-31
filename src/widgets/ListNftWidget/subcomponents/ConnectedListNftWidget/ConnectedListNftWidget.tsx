import React, {
  FC,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { TokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';

import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import { expiryAmounts } from '../../../../constants/expiry';
import { transformNFTTokenToCollectionToken } from '../../../../entities/CollectionToken/CollectionTokenTransformers';
import { AppErrorType, isAppError } from '../../../../errors/appError';
import useInsufficientAmount from '../../../../hooks/useInsufficientAmount';
import useNftTokenApproval from '../../../../hooks/useNftTokenApproval';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { createNftOrder } from '../../../../redux/stores/listNft/listNftActions';
import { approve } from '../../../../redux/stores/orders/ordersActions';
import { ExpiryTimeUnit } from '../../../../types/ExpiryTimeUnit';
import { getTitle } from '../../helpers';
import useTokenAmountAndFee from '../../hooks/useTokenAmountAndFee';
import ListActionButtons from '../ListActionButtons/ListActionButtons';
import ListNftDetailContainer from '../ListNftDetailsContainer/ListNftDetailsContainer';
import ListNftWidgetHeader from '../ListNftWidgetHeader/ListNftWidgetHeader';

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
  account: string;
  chainId: number;
  collectionTokenInfo: TokenInfo;
  currencyTokenInfo: TokenInfo;
  library: Web3Provider
  className?: string;
}

const ConnectedListNftWidget: FC<ListNftWidgetProps> = ({
  account,
  chainId,
  collectionTokenInfo,
  currencyTokenInfo,
  library,
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const { error: ordersError } = useAppSelector(state => state.orders);
  const { error: listNftError } = useAppSelector(state => state.listNft);
  const { collectionImage } = useAppSelector(state => state.config);
  const { isLoading: isLoadingMetadata, protocolFee, projectFee } = useAppSelector(state => state.metadata);
  const { lastUserOrder } = useAppSelector(state => state.listNft);

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
  const hasInsufficientAmount = useInsufficientAmount(currencyTokenAmount);
  const hasInsufficientExpiryAmount = !expiryAmount || expiryAmount < 0;
  const hasCollectionTokenApproval = useNftTokenApproval(collectionTokenInfo, tokenId);
  const title = useMemo(() => getTitle(widgetState), [widgetState]);

  const handleActionButtonClick = async () => {
    if (widgetState === ListNftState.details) {
      setWidgetState(ListNftState.review);
    }

    if (widgetState === ListNftState.review && !hasCollectionTokenApproval) {
      setWidgetState(ListNftState.approve);

      dispatch(approve({
        tokenInfo: collectionTokenInfo,
        library,
        chainId,
        tokenId,
      }))
        .unwrap()
        .then(() => {
          setWidgetState(ListNftState.approving);
        })
        .catch((e) => {
          if (isAppError(e) && e.type === AppErrorType.rejectedByUser) {
            setWidgetState(ListNftState.review);
          } else {
            setWidgetState(ListNftState.failed);
          }
        });
    }

    if (widgetState === ListNftState.review && hasCollectionTokenApproval) {
      setWidgetState(ListNftState.sign);

      const expiryDate = Date.now() + (expiryAmounts[expiryTimeUnit] * (expiryAmount || 1));

      dispatch(createNftOrder({
        expiry: Math.floor(expiryDate / 1000).toString(),
        library,
        signerWallet: account,
        signerTokenInfo: collectionTokenInfo,
        protocolFee,
        senderTokenInfo: currencyTokenInfo,
        senderAmount: currencyTokenAmount,
        tokenId,
      })).unwrap()
        .then(() => {
          setWidgetState(ListNftState.success);
        })
        .catch((e) => {
          if (isAppError(e) && e.type === AppErrorType.rejectedByUser) {
            setWidgetState(ListNftState.review);
          } else {
            setWidgetState(ListNftState.failed);
          }
        });
    }
  };

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

      <ListNftDetailContainer
        collectionImage={collectionImage}
        collectionToken={collectionToken}
        collectionTokenInfo={collectionTokenInfo}
        currencyTokenAmount={currencyTokenAmount}
        currencyTokenAmountMinusProtocolFee={currencyTokenAmountMinusProtocolFee}
        currencyTokenInfo={currencyTokenInfo}
        error={listNftError || ordersError}
        expiryAmount={expiryAmount}
        expiryTimeUnit={expiryTimeUnit}
        fullOrder={lastUserOrder}
        projectFee={projectFee}
        protocolFee={protocolFee}
        protocolFeeInCurrencyToken={protocolFeeInCurrencyToken}
        tokenId={tokenId}
        widgetState={widgetState}
        onExpiryAmountChange={setExpiryAmount}
        onExpiryTimeUnitChange={setExpiryTimeUnit}
        onTradeTokenInputChange={setCurrencyTokenAmount}
        className="list-nft-widget__trade-details-container"
      />

      {!(widgetState === ListNftState.sign || widgetState === ListNftState.approve || widgetState === ListNftState.approving) && (
        <ListActionButtons
          hasNoCollectionTokenApproval={!hasCollectionTokenApproval}
          hasInsufficientAmount={hasInsufficientAmount}
          hasInsufficientExpiryAmount={hasInsufficientExpiryAmount}
          currencyToken={currencyTokenInfo}
          fullOrder={lastUserOrder}
          state={widgetState}
          onActionButtonClick={handleActionButtonClick}
          className="list-nft-widget__action-buttons"
        />
      )}
    </div>
  );
};

export default ConnectedListNftWidget;
