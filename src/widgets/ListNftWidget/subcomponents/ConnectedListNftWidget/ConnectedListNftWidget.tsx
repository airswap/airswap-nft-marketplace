import React, {
  FC,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { TokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';

import { expiryAmounts } from '../../../../constants/expiry';
import { isCollectionTokenInfo } from '../../../../entities/CollectionToken/CollectionTokenHelpers';
import { SubmittedTransactionStatus } from '../../../../entities/SubmittedTransaction/SubmittedTransaction';
import { AppErrorType, isAppError } from '../../../../errors/appError';
import useApproveNftTransaction from '../../../../hooks/useApproveNftTransaction';
import useCollectionToken from '../../../../hooks/useCollectionToken';
import useInsufficientAmount from '../../../../hooks/useInsufficientAmount';
import useNftTokenApproval from '../../../../hooks/useNftTokenApproval';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { createNftOrder } from '../../../../redux/stores/listNft/listNftActions';
import { approve as approveNft } from '../../../../redux/stores/orders/ordersActions';
import { addInfoToast, addUserRejectedToast } from '../../../../redux/stores/toasts/toastsActions';
import { ExpiryTimeUnit } from '../../../../types/ExpiryTimeUnit';
import { getTitle } from '../../helpers';
import useTokenAmountAndFee from '../../hooks/useTokenAmountAndFee';
import ListActionButtons from '../ListActionButtons/ListActionButtons';
import ListNftDetailContainer from '../ListNftDetailsContainer/ListNftDetailsContainer';
import ListNftWidgetHeader from '../ListNftWidgetHeader/ListNftWidgetHeader';

import '../../ListNftWidget.scss';

export enum ListNftState {
  details = 'details',
  review = 'review',
  approve = 'approve',
  approving = 'approving',
  sign = 'sign',
  success = 'success',
  failed = 'failed',
}

interface ListNftWidgetProps {
  account: string;
  chainId: number;
  currencyTokenInfo: TokenInfo;
  library: Web3Provider
  userTokens: number[];
  className?: string;
}

const ConnectedListNftWidget: FC<ListNftWidgetProps> = ({
  account,
  chainId,
  currencyTokenInfo,
  library,
  userTokens,
  className = '',
}) => {
  const dispatch = useAppDispatch();

  // Store data
  const { error: ordersError } = useAppSelector(state => state.orders);
  const { error: listNftError } = useAppSelector(state => state.listNft);
  const { collectionImage, collectionToken, collectionName } = useAppSelector(state => state.config);
  const { protocolFee, projectFee } = useAppSelector(state => state.metadata);
  const { lastUserOrder } = useAppSelector(state => state.listNft);

  // User input states
  const [widgetState, setWidgetState] = useState<ListNftState>(ListNftState.details);
  const [selectedTokenId, setSelectedTokenId] = useState(userTokens[0]);
  const [currencyTokenAmount, setCurrencyTokenAmount] = useState('0');
  const [expiryTimeUnit, setExpiryTimeUnit] = useState(ExpiryTimeUnit.minutes);
  const [expiryAmount, setExpiryAmount] = useState<number | undefined>(60);

  // States derived from user input
  const [collectionTokenInfo] = useCollectionToken(collectionToken, selectedTokenId);
  const [currencyTokenAmountMinusProtocolFee, protocolFeeInCurrencyToken] = useTokenAmountAndFee(currencyTokenAmount);
  const [approvalTransactionHash, setApprovalTransactionHash] = useState<string>();
  const hasInsufficientAmount = useInsufficientAmount(currencyTokenAmount);
  const hasInsufficientExpiryAmount = !expiryAmount || expiryAmount < 0;
  const hasCollectionTokenApproval = useNftTokenApproval(collectionTokenInfo, selectedTokenId);
  const approveTransaction = useApproveNftTransaction(approvalTransactionHash);
  const title = useMemo(() => getTitle(widgetState), [widgetState]);

  const handleActionButtonClick = async () => {
    if (widgetState === ListNftState.details) {
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

      dispatch(createNftOrder({
        expiry: Math.floor(expiryDate / 1000).toString(),
        library,
        signerWallet: account,
        signerTokenInfo: collectionTokenInfo,
        protocolFee,
        senderTokenInfo: currencyTokenInfo,
        senderAmount: currencyTokenAmountMinusProtocolFee,
        tokenId: selectedTokenId,
      })).unwrap()
        .then(() => {
          setWidgetState(ListNftState.success);
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

  const handleSelectedNftChange = (value: number) => {
    setSelectedTokenId(value);
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

  return (
    <div className={`list-nft-widget ${className}`}>
      <ListNftWidgetHeader
        title={title}
        className="list-nft-widget__header"
      />

      <ListNftDetailContainer
        chainId={chainId}
        collectionImage={collectionImage}
        collectionName={collectionName}
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
        selectedTokenId={selectedTokenId}
        submittedApproval={approveTransaction}
        userTokens={userTokens}
        widgetState={widgetState}
        onExpiryAmountChange={setExpiryAmount}
        onExpiryTimeUnitChange={setExpiryTimeUnit}
        onSelectedNftChange={handleSelectedNftChange}
        onTradeTokenInputChange={setCurrencyTokenAmount}
        className="list-nft-widget__trade-details-container"
      />

      {!(widgetState === ListNftState.sign || widgetState === ListNftState.approve || widgetState === ListNftState.approving) && (
        <ListActionButtons
          hasNoCollectionTokenApproval={!hasCollectionTokenApproval}
          hasInsufficientAmount={hasInsufficientAmount}
          hasInsufficientExpiryAmount={hasInsufficientExpiryAmount}
          currencyToken={currencyTokenInfo}
          state={widgetState}
          tokenId={selectedTokenId}
          onActionButtonClick={handleActionButtonClick}
          onBackButtonClick={handleBackButtonClick}
          className="list-nft-widget__action-buttons"
        />
      )}
    </div>
  );
};

export default ConnectedListNftWidget;
