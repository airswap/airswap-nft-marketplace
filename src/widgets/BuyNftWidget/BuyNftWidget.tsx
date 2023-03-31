import React, { FC } from 'react';

import { useAppSelector } from '../../redux/hooks';
import { selectCollectionTokenInfo, selectCurrencyTokenInfo } from '../../redux/stores/metadata/metadataSlice';
import ConnectedBuyNftWidget from './subcomponents/ConnectedBuyNftWidget/ConnectedBuyNftWidget';
import DisconnectedBuyNftWidget from './subcomponents/DisconnectedBuyNftWidget/DisconnectedBuyNftWidget';

import './BuyNftWidget.scss';

interface BuyNftWidgetProps {
  className?: string;
}

const BuyNftWidget: FC<BuyNftWidgetProps> = ({ className = '' }) => {
  const { isLoading: isLoadingMetadata } = useAppSelector(state => state.metadata);
  const { lastUserOrder } = useAppSelector((state) => state.listNft);

  const collectionTokenInfo = useAppSelector(selectCollectionTokenInfo);
  const currencyTokenInfo = useAppSelector(selectCurrencyTokenInfo);

  if (
    !isLoadingMetadata
    && collectionTokenInfo
    && currencyTokenInfo
    && lastUserOrder
  ) {
    return (
      <ConnectedBuyNftWidget
        collectionTokenInfo={collectionTokenInfo}
        currencyTokenInfo={currencyTokenInfo}
        fullOrder={lastUserOrder}
        className={className}
      />
    );
  }

  return (
    <DisconnectedBuyNftWidget
      isLoading={isLoadingMetadata}
      className={className}
    />
  );
};

export default BuyNftWidget;
