/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */

import {
  FC,
  ReactElement,
  useMemo,
  useState,
} from 'react';

import { CollectionTokenInfo, FullOrder, TokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';

import OrderWidgetHeader from '../../../../compositions/OrderWidgetHeader/OrderWidgetHeader';
import { useAppSelector } from '../../../../redux/hooks';
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
  account: string;
  chainId: number
  collectionTokenInfo: CollectionTokenInfo;
  currencyTokenInfo: TokenInfo;
  fullOrder: FullOrder;
  library: Web3Provider
  className?: string;
}

const ConnectedCancelOrderWidget: FC<ConnectedCancelOrderWidgetProps> = ({
  account,
  chainId,
  collectionTokenInfo,
  currencyTokenInfo,
  fullOrder,
  library,
  className = '',
}): ReactElement => {
  const [widgetState, setWidgetState] = useState<CancelOrderState>(CancelOrderState.failed);
  const { collectionImage, collectionName } = useAppSelector(state => state.config);
  const { protocolFee, projectFee } = useAppSelector(state => state.metadata);

  const title = useMemo(() => getTitle(widgetState), [widgetState]);

  const handleActionButtonClick = async () => {
    if (widgetState === CancelOrderState.details) {
      setWidgetState(CancelOrderState.sign);
    }

    if (widgetState === CancelOrderState.failed) {
      setWidgetState(CancelOrderState.details);
    }
  };

  return (
    <div className={`cancel-order-widget ${className}`}>
      <OrderWidgetHeader
        nftId={+fullOrder.signer.id}
        title={title}
      />
      <CancelDetailsContainer
        collectionImage={collectionImage}
        collectionTokenInfo={collectionTokenInfo}
        currencyTokenInfo={currencyTokenInfo}
        fullOrder={fullOrder}
        projectFee={projectFee}
        protocolFee={protocolFee}
        widgetState={widgetState}
        className="cancel-order-widget__trade-details-container"
      />
      <CancelActionButtons
        nftId={+fullOrder.signer.id}
        state={widgetState}
        onActionButtonClick={handleActionButtonClick}
        className="cancel-order-widget__action-buttons"
      />
    </div>
  );
};

/* eslint-enable @typescript-eslint/no-unused-vars,no-unused-vars */

export default ConnectedCancelOrderWidget;
