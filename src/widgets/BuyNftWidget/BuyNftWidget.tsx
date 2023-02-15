import React, { FC } from 'react';

import { BigNumber } from 'bignumber.js';

import Button from '../../components/Button/Button';
import Icon from '../../components/Icon/Icon';
import TradeDetails from '../../components/TradeDetails/TradeDetails';
import TradeNftDetails from '../../components/TradeNftDetails/TradeNftDetails';
import IconNavLink from '../../compositions/IconNavLink/IconNavLink';
import { useAppSelector } from '../../redux/hooks';
import { selectCollectionTokenInfo, selectCurrencyTokenInfo } from '../../redux/stores/metadata/metadataSlice';
import { AppRoutes } from '../../routes';

import './BuyNftWidget.scss';

interface BuyNftWidgetProps {
  className?: string;
}

const BuyNftWidget: FC<BuyNftWidgetProps> = ({ className = '' }) => {
  const { isLoading: isLoadingMetadata, tokens } = useAppSelector(state => state.metadata);
  const { collectionImage, collectionName } = useAppSelector(state => state.config);
  const collectionToken = useAppSelector(selectCollectionTokenInfo);
  const currencyToken = useAppSelector(selectCurrencyTokenInfo);
  console.log(isLoadingMetadata, tokens, collectionToken, currencyToken);

  return (
    <div className={`buy-nft-widget ${className}`}>
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
          <TradeNftDetails
            collectionImage={collectionImage}
            collectionName={collectionName}
            collectionToken={collectionToken}
            className="buy-nft-widget__trade-details"
          />
          <Icon className="buy-nft-widget__swap-icon" name="swap" />
          <TradeDetails
            amount={new BigNumber('2345000000000000000')}
            title="For"
            tokenInfo={currencyToken}
            className="buy-nft-widget__trade-details"
          />
        </div>
      )}
      <Button
        text="Buy NFT"
        className="buy-nft-widget__action-button"
      />
    </div>
  );
};

export default BuyNftWidget;
