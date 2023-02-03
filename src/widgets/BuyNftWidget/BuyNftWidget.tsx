import React, { FC, useMemo, useState } from 'react';

import { BigNumber } from 'bignumber.js';
import classNames from 'classnames';

import Icon from '../../components/Icon/Icon';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import TradeDetails from '../../components/TradeDetails/TradeDetails';
import TradeNftDetails, { TradeNftDetailsProps } from '../../components/TradeNftDetails/TradeNftDetails';
import IconNavLink from '../../compositions/IconNavLink/IconNavLink';
import TransactionLink from '../../compositions/TransactionLink/TransactionLink';
import { useAppSelector } from '../../redux/hooks';
import { selectCollectionTokenInfo, selectCurrencyTokenInfo } from '../../redux/stores/metadata/metadataSlice';
import { AppRoutes } from '../../routes';
import { getNftDetailsIcon } from './helpers';
import BuyActionButtons from './subcomponents/BuyActionButtons/BuyActionButtons';

import './BuyNftWidget.scss';

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
  const { isLoading: isLoadingMetadata, tokens } = useAppSelector(state => state.metadata);
  const { collectionImage, collectionName } = useAppSelector(state => state.config);
  const collectionToken = useAppSelector(selectCollectionTokenInfo);
  const currencyToken = useAppSelector(selectCurrencyTokenInfo);
  console.log(isLoadingMetadata, tokens, collectionToken, currencyToken);

  const [state, setState] = useState<BuyNftState>(BuyNftState.success);

  const widgetClassName = classNames('buy-nft-widget', {
    [`buy-nft-widget--has-${state}-state`]: state,
  }, className);

  const nftDetailsIcon: TradeNftDetailsProps['icon'] = useMemo(() => getNftDetailsIcon(state), [state]);

  const handleActionButtonClick = () => {
    if (state === BuyNftState.details) {
      setState(BuyNftState.confirm);
    }
  };

  return (
    <div className={widgetClassName}>
      <div className="buy-nft-widget__header">
        <h1 className="buy-nft-widget__title">Buy NFT</h1>
        <IconNavLink
          hideLabel
          icon="close"
          text="Back"
          to={`${AppRoutes.nftDetail}`}
          className="buy-nft-widget__back-button"
        />
      </div>

      <LoadingSpinner className="buy-nft-widget__loading-spinner" />

      {(collectionToken && currencyToken) && (
        <div className="buy-nft-widget__trade-details-container">
          {state === BuyNftState.details || state === BuyNftState.success || state === BuyNftState.failed ? (
            <TradeNftDetails
              icon={nftDetailsIcon}
              collectionImage={collectionImage}
              collectionName={collectionName}
              collectionToken={collectionToken}
              className="buy-nft-widget__trade-details"
            />
          ) : (
            <TradeDetails
              title="Buy"
              tokenInfo={collectionToken}
            />
          )}

          {!(state === BuyNftState.success || state === BuyNftState.failed) && (
            <>
              <div className="buy-nft-widget__swap-icon-container">
                <Icon className="buy-nft-widget__swap-icon" name="swap" />
              </div>
              <TradeDetails
                amount={new BigNumber('2345000000000000000')}
                title="For"
                tokenInfo={currencyToken}
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
