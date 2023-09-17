import {
  FC,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { CollectionTokenInfo, FullOrder, TokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';

import OrderWidgetHeader from '../../../../compositions/OrderWidgetHeader/OrderWidgetHeader';
import { AppErrorType, isAppError } from '../../../../errors/appError';
import useCancelOrderTransaction from '../../../../hooks/useCancelOrderTransaction';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { cancel } from '../../../../redux/stores/orders/ordersActions';
import { addUserRejectedToast } from '../../../../redux/stores/toasts/toastsActions';
import { getTitle } from '../../helpers';
import CancelActionButtons from '../CancelActionButtons/CancelActionButtons';
import CancelDetailsContainer from '../CancelDetailsContainer/CancelDetailsContainer';

export enum CancelOrderState {
  details = 'details',
  sign = 'sign',
  canceling = 'canceling',
  success = 'success',
  failed = 'failed',
}

interface ConnectedCancelOrderWidgetProps {
  chainId: number
  collectionTokenInfo: CollectionTokenInfo;
  currencyTokenInfo: TokenInfo;
  fullOrder: FullOrder;
  library: Web3Provider
  className?: string;
}

const ConnectedCancelOrderWidget: FC<ConnectedCancelOrderWidgetProps> = ({
  chainId,
  collectionTokenInfo,
  currencyTokenInfo,
  fullOrder,
  library,
  className = '',
}): ReactElement => {
  const dispatch = useAppDispatch();
  const [widgetState, setWidgetState] = useState<CancelOrderState>(CancelOrderState.details);
  const [cancelTransactionHash, setCancelTransactionHash] = useState<string>();

  const { collectionImage } = useAppSelector(state => state.config);
  const { protocolFee, projectFee } = useAppSelector(state => state.metadata);
  const cancelOrderTransaction = useCancelOrderTransaction(cancelTransactionHash);

  const title = useMemo(() => getTitle(widgetState), [widgetState]);

  const handleActionButtonClick = async () => {
    if (widgetState === CancelOrderState.details) {
      setWidgetState(CancelOrderState.sign);
      dispatch(cancel({ order: fullOrder, chainId, library }))
        .unwrap()
        .then((transactionHash) => {
          if (typeof transactionHash === 'string') {
            setCancelTransactionHash(transactionHash);
          }
        })
        .catch((e) => {
          if (isAppError(e) && e.type === AppErrorType.rejectedByUser) {
            dispatch(addUserRejectedToast());
            setWidgetState(CancelOrderState.details);
          } else {
            setWidgetState(CancelOrderState.failed);
          }
        });
    }

    if (widgetState === CancelOrderState.failed) {
      setWidgetState(CancelOrderState.details);
    }
  };

  useEffect(() => {
    if (cancelOrderTransaction?.status === 'processing') {
      setWidgetState(CancelOrderState.canceling);
    }

    if (cancelOrderTransaction?.status === 'succeeded') {
      setWidgetState(CancelOrderState.success);
    }

    if (cancelOrderTransaction?.status === 'failed') {
      setWidgetState(CancelOrderState.failed);
    }
  }, [cancelOrderTransaction]);

  return (
    <div className={`cancel-order-widget ${className}`}>
      <OrderWidgetHeader
        nftId={fullOrder.signer.id}
        title={title}
      />
      <CancelDetailsContainer
        chainId={chainId}
        collectionImage={collectionImage}
        collectionTokenInfo={collectionTokenInfo}
        currencyTokenInfo={currencyTokenInfo}
        fullOrder={fullOrder}
        projectFee={projectFee}
        protocolFee={protocolFee}
        submittedTransaction={cancelOrderTransaction}
        widgetState={widgetState}
        className="cancel-order-widget__trade-details-container"
      />
      <CancelActionButtons
        nftId={fullOrder.signer.id}
        state={widgetState}
        onActionButtonClick={handleActionButtonClick}
        className="cancel-order-widget__action-buttons"
      />
    </div>
  );
};

export default ConnectedCancelOrderWidget;
