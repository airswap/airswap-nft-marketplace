import React, { FC } from 'react';

import { useWeb3React } from '@web3-react/core';

import { useAppSelector } from '../../redux/hooks';
import { selectCollectionTokenInfo, selectCurrencyTokenInfo } from '../../redux/stores/metadata/metadataSlice';
import ConnectedListNftWidget from './subcomponents/ConnectedListNftWidget/ConnectedListNftWidget';
import DisconnectedListNftWidget from './subcomponents/DisconnectedListNftWidget/DisconnectedListNftWidget';

interface ListNftWidgetProps {
  className?: string;
}

const ListNftWidget: FC<ListNftWidgetProps> = ({ className = '' }) => {
  const { account, library, chainId } = useWeb3React();
  const { isLoading: isMetadataLoading } = useAppSelector(state => state.metadata);
  const { isLoading: isBalancesLoading } = useAppSelector(state => state.balances);
  const currencyToken = useAppSelector(selectCurrencyTokenInfo);
  const collectionToken = useAppSelector(selectCollectionTokenInfo);
  const isLoading = isBalancesLoading || isMetadataLoading;

  if (
    !isLoading
    && account
    && chainId
    && collectionToken
    && currencyToken
    && library
  ) {
    return (
      <ConnectedListNftWidget
        account={account}
        library={library}
        chainId={chainId}
        collectionTokenInfo={collectionToken}
        currencyTokenInfo={currencyToken}
        className={className}
      />
    );
  }

  return (
    <DisconnectedListNftWidget
      isLoading={isLoading}
      className={className}
    />
  );
};

export default ListNftWidget;
