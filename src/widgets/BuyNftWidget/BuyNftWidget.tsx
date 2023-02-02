import React, { FC, useState } from 'react';

import { BigNumber } from 'bignumber.js';
import classNames from 'classnames';

import Icon from '../../components/Icon/Icon';
import TradeDetails from '../../components/TradeDetails/TradeDetails';
import TradeNftDetails from '../../components/TradeNftDetails/TradeNftDetails';
import IconNavLink from '../../compositions/IconNavLink/IconNavLink';
import { useAppSelector } from '../../redux/hooks';
import { selectCollectionTokenInfo, selectCurrencyTokenInfo } from '../../redux/stores/metadata/metadataSlice';
import { AppRoutes } from '../../routes';
import BuyActionButtons from './subcomponents/BuyActionButtons/BuyActionButtons';

import './BuyNftWidget.scss';

export enum BuyNftState {
  details = 'details',
  confirm = 'confirm',
  pending = 'pending',
  success = 'success',
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

  const [state, setState] = useState<BuyNftState>(BuyNftState.details);

  const widgetClassName = classNames('buy-nft-widget', {
    [`buy-nft-widget--has-${state}-state`]: state,
  }, className);

  const handleActionButtonClick = () => {
    if (state === BuyNftState.details) {
      setState(BuyNftState.confirm);
    }

    if (state === BuyNftState.confirm) {
      setState(BuyNftState.pending);
    }

    if (state === BuyNftState.pending) {
      setState(BuyNftState.success);
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

      {(collectionToken && currencyToken) && (
        <div className="buy-nft-widget__trade-details-container">
          {state === BuyNftState.details ? (
            <TradeNftDetails
              collectionImage={collectionImage}
              collectionName={collectionName}
              collectionToken={collectionToken}
              className="buy-nft-widget__trade-details"
            />
          ) : (
            <TradeDetails
              amount={new BigNumber('1')}
              title="Buy"
              tokenInfo={collectionToken}
            />
          )}
          <Icon className="buy-nft-widget__swap-icon" name="swap" />
          <TradeDetails
            amount={new BigNumber('2345000000000000000')}
            title="For"
            tokenInfo={currencyToken}
            className="buy-nft-widget__trade-details"
          />
        </div>
      )}
      <BuyActionButtons
        state={state}
        onActionButtonClick={handleActionButtonClick}
        className="buy-nft-widget__action-buttons"
      />
    </div>
  );
};

export default BuyNftWidget;
