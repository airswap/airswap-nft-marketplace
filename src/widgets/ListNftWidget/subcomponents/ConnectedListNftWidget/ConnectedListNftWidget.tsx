import React, { FC, useEffect, useState } from 'react';

import { FullOrder, TokenInfo } from '@airswap/utils';
import { Web3Provider } from '@ethersproject/providers';

import { expiryAmounts } from '../../../../constants/expiry';
import { isCollectionTokenInfo } from '../../../../entities/CollectionToken/CollectionTokenHelpers';
import { ExtendedFullOrder } from '../../../../entities/FullOrder/FullOrder';
import { SubmittedTransactionStatus } from '../../../../entities/SubmittedTransaction/SubmittedTransaction';
import { AppErrorType, isAppError } from '../../../../errors/appError';
import { toMaxAllowedDecimalsNumberString } from '../../../../helpers/input';
import useApproveNftTransaction from '../../../../hooks/useApproveNftTransaction';
import useCollectionImage from '../../../../hooks/useCollectionImage';
import useCollectionToken from '../../../../hooks/useCollectionToken';
import useIndexedOrderResult from '../../../../hooks/useIndexedOrderResult';
import useInsufficientAmount from '../../../../hooks/useInsufficientAmount';
import useNftTokenApproval from '../../../../hooks/useNftTokenApproval';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { createNftOrder } from '../../../../redux/stores/listNft/listNftActions';
import { approve as approveNft } from '../../../../redux/stores/orders/ordersActions';
import { addInfoToast, addUserRejectedToast } from '../../../../redux/stores/toasts/toastsActions';
import { ExpiryTimeUnit } from '../../../../types/ExpiryTimeUnit';
import { IndexedOrderResult } from '../../../../types/IndexedOrderResult';
import { NftTokenKind } from '../../../../types/NftTokenKind';
import useTokenAmountAndFee from '../../hooks/useTokenAmountAndFee';
import ListActionButtons from '../ListActionButtons/ListActionButtons';
import ListNftDetailContainer from '../ListNftDetailsContainer/ListNftDetailsContainer';
import ListNftWidgetHeader from '../ListNftWidgetHeader/ListNftWidgetHeader';

import '../../ListNftWidget.scss';

export enum ListNftState {
  approve = 'approve',
  approving = 'approving',
  details = 'details',
  failed = 'failed',
  indexing = 'indexing',
  review = 'review',
  selectNft = 'selectNft',
  sign = 'sign',
  success = 'success',
  tokenAlreadyListedWarning = 'tokenAlreadyListedWarning',
}

interface ListNftWidgetProps {
  account: string;
  chainId: number;
  currencyTokenInfo: TokenInfo;
  defaultSelectedTokenId?: string;
  library: Web3Provider
  userOrders: ExtendedFullOrder[];
  userTokens: string[];
  className?: string;
}

const ConnectedListNftWidget: FC<ListNftWidgetProps> = ({
  account,
  chainId,
  currencyTokenInfo,
  defaultSelectedTokenId,
  library,
  userOrders,
  userTokens,
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const { bannerImage } = useCollectionImage();

  // Store data
  const { error: ordersError } = useAppSelector(state => state.orders);
  const { error: listNftError } = useAppSelector(state => state.listNft);
  const { collectionToken, collectionName } = useAppSelector(state => state.config);
  const { protocolFee, projectFee } = useAppSelector(state => state.metadata);

  // User input states
  const [widgetState, setWidgetState] = useState<ListNftState>(ListNftState.details);
  const [selectedTokenId, setSelectedTokenId] = useState(defaultSelectedTokenId || userTokens[0]);
  const [currencyTokenAmount, setCurrencyTokenAmount] = useState('0');
  const [expiryTimeUnit, setExpiryTimeUnit] = useState(ExpiryTimeUnit.minutes);
  const [expiryAmount, setExpiryAmount] = useState<number | undefined>(60);

  // States derived from user input
  const [collectionTokenInfo] = useCollectionToken(collectionToken, selectedTokenId);
  const [currencyTokenAmountMinusProtocolFee, protocolFeeInCurrencyToken] = useTokenAmountAndFee(currencyTokenAmount);
  const [approvalTransactionHash, setApprovalTransactionHash] = useState<string>();
  const [order, setOrder] = useState<FullOrder>();
  const hasInsufficientAmount = useInsufficientAmount(currencyTokenAmount);
  const hasInsufficientExpiryAmount = !expiryAmount || expiryAmount < 0;
  const hasCollectionTokenApproval = useNftTokenApproval(collectionTokenInfo, selectedTokenId);
  const approveTransaction = useApproveNftTransaction(approvalTransactionHash);
  const [indexedOrderResult, indexerError] = useIndexedOrderResult(order?.nonce);
  const activeUserOrder = userOrders.find(userOrder => userOrder.signer.id === selectedTokenId);

  const handleActionButtonClick = async () => {
    if (widgetState === ListNftState.details && activeUserOrder) {
      setWidgetState(ListNftState.tokenAlreadyListedWarning);

      return;
    }

    if (widgetState === ListNftState.details || widgetState === ListNftState.tokenAlreadyListedWarning) {
      setWidgetState(ListNftState.review);
    }

    if (widgetState === ListNftState.review && collectionTokenInfo && !hasCollectionTokenApproval) {
      setWidgetState(ListNftState.approve);

      dispatch(approveNft({
        tokenInfo: collectionTokenInfo,
        library,
        chainId,
        tokenId: selectedTokenId,
      }))
        .unwrap()
        .then((transactionHash) => {
          if (typeof transactionHash === 'string') {
            setApprovalTransactionHash(transactionHash);
          }
          setWidgetState(ListNftState.approving);
        })
        .catch((e) => {
          if (isAppError(e) && e.type === AppErrorType.rejectedByUser) {
            dispatch(addUserRejectedToast());
            setWidgetState(ListNftState.review);
          } else {
            setWidgetState(ListNftState.failed);
          }
        });
    }

    if (
      widgetState === ListNftState.review
      && isCollectionTokenInfo(collectionTokenInfo)
      && hasCollectionTokenApproval
      && currencyTokenAmountMinusProtocolFee
    ) {
      setWidgetState(ListNftState.sign);

      const expiryDate = Date.now() + (expiryAmounts[expiryTimeUnit] * (expiryAmount || 1));
      const kind = collectionTokenInfo.kind as unknown as NftTokenKind;

      dispatch(createNftOrder({
        expiry: Math.floor(expiryDate / 1000).toString(),
        kind,
        library,
        signerWallet: account,
        signerTokenInfo: collectionTokenInfo,
        protocolFee,
        senderTokenInfo: currencyTokenInfo,
        senderAmount: currencyTokenAmountMinusProtocolFee,
        tokenId: selectedTokenId,
      })).unwrap()
        .then((result) => {
          setOrder(result);
          setWidgetState(ListNftState.indexing);
        })
        .catch((e) => {
          if (isAppError(e) && e.type === AppErrorType.rejectedByUser) {
            dispatch(addUserRejectedToast());
            setWidgetState(ListNftState.review);
          } else {
            setWidgetState(ListNftState.failed);
          }
        });
    }
  };

  const handleBackButtonClick = () => {
    setWidgetState(ListNftState.details);
  };

  const handleTradeTokenInputChange = (value: string) => {
    setCurrencyTokenAmount(toMaxAllowedDecimalsNumberString(value, currencyTokenInfo.decimals));
  };

  const handleSelectNftButtonClick = () => {
    setWidgetState(ListNftState.selectNft);
  };

  const handleSelectedNftChange = (tokenId: string) => {
    setSelectedTokenId(tokenId);
    setWidgetState(ListNftState.details);
  };

  useEffect(() => {
    if (approveTransaction?.status === SubmittedTransactionStatus.processing) {
      setWidgetState(ListNftState.approving);
    }

    if (approveTransaction?.status === SubmittedTransactionStatus.succeeded && isCollectionTokenInfo(collectionTokenInfo)) {
      dispatch(addInfoToast('Approved', `Approved ${collectionTokenInfo.name} to be spend.`));
      setWidgetState(ListNftState.review);
    }
  }, [approveTransaction]);

  useEffect(() => {
    if (!selectedTokenId) {
      setSelectedTokenId(userTokens[0]);
    }
  }, [userTokens]);

  useEffect(() => {
    if (indexedOrderResult === IndexedOrderResult.success) {
      setWidgetState(ListNftState.success);
    }

    if (indexedOrderResult === IndexedOrderResult.failed) {
      setWidgetState(ListNftState.failed);
    }
  }, [indexedOrderResult]);

  return (
    <div className={`list-nft-widget ${className}`}>
      <ListNftWidgetHeader
        state={widgetState}
        onBackButtonClick={handleBackButtonClick}
        className="list-nft-widget__header"
      />

      <ListNftDetailContainer
        chainId={chainId}
        collectionImage={bannerImage}
        collectionName={collectionName}
        collectionTokenInfo={collectionTokenInfo}
        currencyTokenAmount={currencyTokenAmount}
        currencyTokenAmountMinusProtocolFee={currencyTokenAmountMinusProtocolFee}
        currencyTokenInfo={currencyTokenInfo}
        error={listNftError || ordersError || indexerError}
        expiryAmount={expiryAmount}
        expiryTimeUnit={expiryTimeUnit}
        fullOrder={order}
        projectFee={projectFee}
        protocolFee={protocolFee}
        protocolFeeInCurrencyToken={protocolFeeInCurrencyToken}
        selectedTokenId={selectedTokenId}
        submittedApproval={approveTransaction}
        userTokens={userTokens}
        widgetState={widgetState}
        onExpiryAmountChange={setExpiryAmount}
        onExpiryTimeUnitChange={setExpiryTimeUnit}
        onSelectedNftChange={handleSelectedNftChange}
        onSelectNftButtonClick={handleSelectNftButtonClick}
        onTradeTokenInputChange={handleTradeTokenInputChange}
        className="list-nft-widget__trade-details-container"
      />

      {!(
        widgetState === ListNftState.sign
        || widgetState === ListNftState.approve
        || widgetState === ListNftState.approving
        || widgetState === ListNftState.selectNft
      ) && (
        <ListActionButtons
          hasNoCollectionTokenApproval={!hasCollectionTokenApproval}
          hasInsufficientAmount={hasInsufficientAmount}
          hasInsufficientExpiryAmount={hasInsufficientExpiryAmount}
          account={account}
          activeUserOrder={activeUserOrder}
          currencyToken={currencyTokenInfo}
          tokenId={selectedTokenId}
          orderNonce={order?.nonce}
          state={widgetState}
          onActionButtonClick={handleActionButtonClick}
          onBackButtonClick={handleBackButtonClick}
          className="list-nft-widget__action-buttons"
        />
      )}
    </div>
  );
};

export default ConnectedListNftWidget;
