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
import CancelOrderWidgetDetailsContainer from '../CancelOrderWidgetDetailsContainer/CancelOrderWidgetDetailsContainer';

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
  const [widgetState, setWidgetState] = useState<CancelOrderState>(CancelOrderState.details);
  const { collectionImage, collectionName } = useAppSelector(state => state.config);
  const { protocolFee, projectFee } = useAppSelector(state => state.metadata);

  const title = useMemo(() => getTitle(widgetState), [widgetState]);

  return (
    <div className={`cancel-order-widget ${className}`}>
      <OrderWidgetHeader
        nftId={+fullOrder.signer.id}
        title={title}
      />
      <CancelOrderWidgetDetailsContainer
        collectionImage={collectionImage}
        collectionTokenInfo={collectionTokenInfo}
        currencyTokenInfo={currencyTokenInfo}
        fullOrder={fullOrder}
        projectFee={projectFee}
        protocolFee={protocolFee}
        widgetState={widgetState}
      />
    </div>
  );
};

/* eslint-enable @typescript-eslint/no-unused-vars,no-unused-vars */

export default ConnectedCancelOrderWidget;
