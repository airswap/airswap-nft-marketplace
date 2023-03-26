import React, {
  FC,
  useMemo,
  useState,
} from 'react';

import { FullOrder, TokenInfo } from '@airswap/types';
import { BigNumber } from 'bignumber.js';
import classNames from 'classnames';

import Icon from '../../../../components/Icon/Icon';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import TradeDetails from '../../../../components/TradeDetails/TradeDetails';
import TradeNftDetails, { TradeNftDetailsProps } from '../../../../components/TradeNftDetails/TradeNftDetails';
import TransactionLink from '../../../../compositions/TransactionLink/TransactionLink';
import { transformNFTTokenToCollectionToken } from '../../../../entities/CollectionToken/CollectionTokenTransformers';
import { useAppSelector } from '../../../../redux/hooks';
import { getNftDetailsIcon, getTitle } from '../../helpers';
import BuyActionButtons from '../BuyActionButtons/BuyActionButtons';
import BuyNftWidgetHeader from '../BuyNftWidgetHeader/BuyNftWidgetHeader';

import '../../BuyNftWidget.scss';

// TODO: Move BuyNftState to store when it's made
export enum BuyNftState {
  details = 'details',
  confirm = 'confirm',
  pending = 'pending',
  success = 'success',
  failed = 'failed',
}

interface ConnectedBuyNftWidgetProps {
  collectionTokenInfo: TokenInfo;
  currencyTokenInfo: TokenInfo;
  fullOrder: FullOrder;
  className?: string;
}

const BuyNftWidget: FC<ConnectedBuyNftWidgetProps> = ({
  collectionTokenInfo,
  currencyTokenInfo,
  fullOrder,
  className = '',
}) => {
  const { collectionImage, collectionName } = useAppSelector(state => state.config);

  const collectionToken = collectionTokenInfo ? transformNFTTokenToCollectionToken(collectionTokenInfo, parseInt(fullOrder.signer.token, 10), '1') : undefined;

  const [widgetState, setWidgetState] = useState<BuyNftState>(BuyNftState.details);

  const widgetClassName = classNames('buy-nft-widget', {
    [`buy-nft-widget--has-${widgetState}-state`]: widgetState,
  }, className);

  const nftDetailsIcon: TradeNftDetailsProps['icon'] = useMemo(() => getNftDetailsIcon(widgetState), [widgetState]);
  const title = useMemo(() => getTitle(widgetState), [widgetState]);

  const handleActionButtonClick = () => {
    if (widgetState === BuyNftState.details) {
      setWidgetState(BuyNftState.confirm);
    }
  };

  return (
    <div className={widgetClassName}>
      <BuyNftWidgetHeader
        title={title}
        className="buy-nft-widget__header"
      />
      <LoadingSpinner className="buy-nft-widget__loading-spinner" />

      <div className="buy-nft-widget__trade-details-container">
        {widgetState === BuyNftState.details || widgetState === BuyNftState.success || widgetState === BuyNftState.failed ? (
          <TradeNftDetails
            icon={nftDetailsIcon}
            collectionImage={collectionImage}
            collectionName={collectionName}
            collectionToken={collectionTokenInfo}
            className="buy-nft-widget__trade-details"
          />
        ) : (
          <TradeDetails
            logoURI={collectionToken ? collectionToken.image : collectionImage}
            title="Buy"
            token={collectionTokenInfo}
          />
        )}

        {!(widgetState === BuyNftState.success || widgetState === BuyNftState.failed) && (
          <>
            <div className="buy-nft-widget__swap-icon-container">
              <Icon className="buy-nft-widget__swap-icon" name="swap" />
            </div>
            <TradeDetails
              amount={new BigNumber(fullOrder.sender.amount)}
              logoURI={currencyTokenInfo.logoURI}
              title="For"
              token={currencyTokenInfo}
              className="buy-nft-widget__trade-details"
            />
          </>
        )}
      </div>

      <TransactionLink to="test" className="buy-nft-widget__transaction-link" />
      <BuyActionButtons
        state={widgetState}
        onActionButtonClick={handleActionButtonClick}
        className="buy-nft-widget__action-buttons"
      />
    </div>
  );
};

export default BuyNftWidget;
