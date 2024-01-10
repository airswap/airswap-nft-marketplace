import React, {
  FC,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { CollectionTokenInfo, FullOrder, TokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';

import OrderWidgetHeader from '../../../../compositions/OrderWidgetHeader/OrderWidgetHeader';
import { getFullOrderSenderAmountPlusTotalFees } from '../../../../entities/FullOrder/FullOrderHelpers';
import { AppErrorType, isAppError } from '../../../../errors/appError';
import useApproveCurrencyTokenTransaction from '../../../../hooks/useApproveCurrencyTokenTransaction';
import useFullOrderExpired from '../../../../hooks/useFullOrderExpired';
import useInsufficientBalance from '../../../../hooks/useInsufficientBalance';
import useOrderTransaction from '../../../../hooks/useOrderTransaction';
import useSufficientErc20Allowance from '../../../../hooks/useSufficientErc20Allowance';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { approve as approveErc20, take } from '../../../../redux/stores/orders/ordersActions';
import { setError } from '../../../../redux/stores/orders/ordersSlice';
import { addInfoToast, addUserRejectedToast } from '../../../../redux/stores/toasts/toastsActions';
import { getTitle } from '../../helpers';
import BuyActionButtons from '../BuyActionButtons/BuyActionButtons';
import BuyNftWidgetDetailsContainer from '../BuyNftWidgetDetailsContainer/BuyNftWidgetDetailsContainer';

export enum BuyNftState {
  details = 'details',
  approve = 'approve',
  approving = 'approving',
  sign = 'sign',
  buying = 'buying',
  success = 'success',
  failed = 'failed',
}

interface ConnectedBuyNftWidgetProps {
  isOrderNonceUsed: boolean;
  account: string;
  chainId: number
  collectionTokenInfo: CollectionTokenInfo;
  currencyTokenInfo: TokenInfo;
  fullOrder: FullOrder;
  library: Web3Provider;
  className?: string;
}

const BuyNftWidget: FC<ConnectedBuyNftWidgetProps> = ({
  isOrderNonceUsed,
  account,
  chainId,
  collectionTokenInfo,
  currencyTokenInfo,
  fullOrder,
  library,
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const { collectionImage, collectionName } = useAppSelector(state => state.config);
  const { error } = useAppSelector(state => state.orders);

  const [widgetState, setWidgetState] = useState<BuyNftState>(BuyNftState.details);
  const [approvalTransactionHash, setApprovalTransactionHash] = useState<string>();

  const hasInsufficientBalance = useInsufficientBalance(fullOrder.sender.amount);
  const hasSufficientCurrencyAllowance = useSufficientErc20Allowance(fullOrder);
  const approveTransaction = useApproveCurrencyTokenTransaction(approvalTransactionHash);
  const orderTransaction = useOrderTransaction(fullOrder.nonce);
  const isOrderExpired = useFullOrderExpired(fullOrder.expiry);
  const ownerIsAccount = fullOrder.signer.wallet.toLowerCase() === account.toLowerCase();

  const title = useMemo(() => getTitle(widgetState), [widgetState]);

  const handleActionButtonClick = async () => {
    if (widgetState === BuyNftState.details && !hasSufficientCurrencyAllowance) {
      setWidgetState(BuyNftState.approve);

      dispatch(approveErc20({
        amount: getFullOrderSenderAmountPlusTotalFees(fullOrder).toNumber(),
        tokenInfo: currencyTokenInfo,
        library,
        chainId,
      }))
        .unwrap()
        .then((transactionHash) => {
          if (typeof transactionHash === 'string') {
            setApprovalTransactionHash(transactionHash);
          }
        })
        .catch((e) => {
          if (isAppError(e) && e.type === AppErrorType.rejectedByUser) {
            dispatch(addUserRejectedToast());
            setWidgetState(BuyNftState.details);
          } else {
            setWidgetState(BuyNftState.failed);
          }
        });
    }

    if (widgetState === BuyNftState.details && hasSufficientCurrencyAllowance) {
      setWidgetState(BuyNftState.sign);

      dispatch(take({
        order: fullOrder,
        senderWallet: account,
        library,
      }));
    }

    if (widgetState === BuyNftState.failed) {
      dispatch(setError(undefined));
    }
  };

  useEffect(() => {
    if (approveTransaction?.status === 'processing') {
      setWidgetState(BuyNftState.approving);
    }

    if (approveTransaction?.status === 'succeeded') {
      dispatch(addInfoToast('Approved', `Approved ${currencyTokenInfo.symbol} to be spend.`));
      setWidgetState(BuyNftState.details);
    }
  }, [approveTransaction]);

  useEffect(() => {
    if (orderTransaction?.status === 'processing') {
      setWidgetState(BuyNftState.buying);
    }

    if (orderTransaction?.status === 'succeeded') {
      setWidgetState(BuyNftState.success);
    }
  }, [orderTransaction]);

  useEffect(() => {
    if (!error) {
      return;
    }

    if (error?.type === AppErrorType.rejectedByUser) {
      dispatch(addUserRejectedToast());
      setWidgetState(BuyNftState.details);
    } else {
      setWidgetState(BuyNftState.failed);
    }
  }, [error]);

  // This will clear the store when unmounting the component
  useEffect((): () => void => () => dispatch(setError(undefined)), []);

  return (
    <div className={`buy-nft-widget ${className}`}>
      <OrderWidgetHeader
        nftId={collectionTokenInfo.id}
        title={title}
        className="buy-nft-widget__header"
      />

      <BuyNftWidgetDetailsContainer
        chainId={chainId}
        collectionImage={collectionImage}
        collectionName={collectionName}
        collectionTokenInfo={collectionTokenInfo}
        currencyTokenInfo={currencyTokenInfo}
        error={error}
        fullOrder={fullOrder}
        submittedApproval={approveTransaction}
        submittedOrder={orderTransaction}
        widgetState={widgetState}
        className="buy-nft-widget__trade-details-container"
      />

      <BuyActionButtons
        hasInsufficientAmount={hasInsufficientBalance}
        hasNoCurrencyTokenApproval={!hasSufficientCurrencyAllowance}
        isOrderExpired={isOrderExpired}
        isOrderNonceUsed={isOrderNonceUsed}
        ownerIsAccount={ownerIsAccount}
        account={account}
        collectionTokenInfo={collectionTokenInfo}
        currencyTokenSymbol={currencyTokenInfo.symbol}
        state={widgetState}
        onActionButtonClick={handleActionButtonClick}
        className="buy-nft-widget__action-buttons"
      />
    </div>
  );
};

export default BuyNftWidget;
