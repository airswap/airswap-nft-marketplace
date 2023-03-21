import React, {
  FC,
  useMemo,
  useState,
} from 'react';

import { BigNumber } from 'bignumber.js';
import classNames from 'classnames';

import Icon from '../../components/Icon/Icon';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import TradeDetails from '../../components/TradeDetails/TradeDetails';
import TradeNftDetails, { TradeNftDetailsProps } from '../../components/TradeNftDetails/TradeNftDetails';
import TransactionLink from '../../compositions/TransactionLink/TransactionLink';
import { transformNFTTokenToCollectionToken } from '../../entities/CollectionToken/CollectionTokenTransformers';
import { useAppSelector } from '../../redux/hooks';
import { selectCollectionTokenInfo, selectCurrencyTokenInfo } from '../../redux/stores/metadata/metadataSlice';
import { getNftDetailsIcon, getTitle } from './helpers';
import BuyActionButtons from './subcomponents/BuyActionButtons/BuyActionButtons';
import BuyNftWidgetHeader from './subcomponents/BuyNftWidgetHeader/BuyNftWidgetHeader';

import './BuyNftWidget.scss';

// TODO: Move BuyNftState to store when it's made
export enum BuyNftState {
  details = 'details',
  confirm = 'confirm',
  pending = 'pending',
  success = 'success',
  failed = 'failed',
}

interface BuyNftWidgetProps {
  className?: string;
}

const BuyNftWidget: FC<BuyNftWidgetProps> = ({ className = '' }) => {
  const { isLoading: isLoadingMetadata } = useAppSelector(state => state.metadata);
  const { collectionImage, collectionName } = useAppSelector(state => state.config);
  const collectionTokenInfo = useAppSelector(selectCollectionTokenInfo);
  const currencyTokenInfo = useAppSelector(selectCurrencyTokenInfo);

  // TODO: Get tokenId from owned nfts in store https://github.com/airswap/airswap-marketplace/issues/62
  const collectionToken = collectionTokenInfo ? transformNFTTokenToCollectionToken(collectionTokenInfo, 78426, '1') : undefined;

  const [state, setState] = useState<BuyNftState>(BuyNftState.details);

  const widgetClassName = classNames('buy-nft-widget', {
    [`buy-nft-widget--has-${state}-state`]: state,
  }, className);

  const nftDetailsIcon: TradeNftDetailsProps['icon'] = useMemo(() => getNftDetailsIcon(state), [state]);
  const title = useMemo(() => getTitle(state), [state]);

  const handleActionButtonClick = () => {
    if (state === BuyNftState.details) {
      setState(BuyNftState.confirm);
    }
  };

  if (isLoadingMetadata) {
    return (
      <div className={`buy-nft-widget ${className}`}>
        <BuyNftWidgetHeader
          title={title}
          className="buy-nft-widget__header"
        />
        <LoadingSpinner className="buy-nft-widget__loading-spinner" />
      </div>
    );
  }

  return (
    <div className={widgetClassName}>
      <BuyNftWidgetHeader
        title={title}
        className="buy-nft-widget__header"
      />
      <LoadingSpinner className="buy-nft-widget__loading-spinner" />

      {(collectionTokenInfo && currencyTokenInfo) && (
        <div className="buy-nft-widget__trade-details-container">
          {state === BuyNftState.details || state === BuyNftState.success || state === BuyNftState.failed ? (
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

          {!(state === BuyNftState.success || state === BuyNftState.failed) && (
            <>
              <div className="buy-nft-widget__swap-icon-container">
                <Icon className="buy-nft-widget__swap-icon" name="swap" />
              </div>
              <TradeDetails
                amount={new BigNumber('2345000000000000000')}
                logoURI={currencyTokenInfo.logoURI}
                title="For"
                token={currencyTokenInfo}
                className="buy-nft-widget__trade-details"
              />
            </>
          )}
        </div>
      )}
      <TransactionLink to="test" className="buy-nft-widget__transaction-link" />
      <BuyActionButtons
        state={state}
        onActionButtonClick={handleActionButtonClick}
        className="buy-nft-widget__action-buttons"
      />
    </div>
  );
};

export default BuyNftWidget;
