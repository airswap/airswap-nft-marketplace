import React, { FC } from 'react';

import { useWeb3React } from '@web3-react/core';

import { useAppSelector } from '../../redux/hooks';
import { selectCurrencyTokenInfo } from '../../redux/stores/metadata/metadataSlice';
import ConnectedListNftWidget from './subcomponents/ConnectedListNftWidget/ConnectedListNftWidget';
import DisconnectedListNftWidget from './subcomponents/DisconnectedListNftWidget/DisconnectedListNftWidget';

interface ListNftWidgetProps {
  className?: string;
}

const ListNftWidget: FC<ListNftWidgetProps> = ({ className = '' }) => {
  const { account, library, chainId } = useWeb3React();
  const { tokens: userTokens } = useAppSelector(state => state.balances);
  const { isLoading: isMetadataLoading } = useAppSelector(state => state.metadata);
  const { isInitialized: isBalancesInitialized } = useAppSelector(state => state.balances);
  const currencyToken = useAppSelector(selectCurrencyTokenInfo);
  const isLoading = !isBalancesInitialized || isMetadataLoading;

  if (
    !isLoading
    && account
    && chainId
    && currencyToken
    && library
    && userTokens.length
  ) {
    return (
      <ConnectedListNftWidget
        account={account}
        chainId={chainId}
        currencyTokenInfo={currencyToken}
        library={library}
        userTokens={userTokens}
        className={className}
      />
    );
  }

  return (
    <DisconnectedListNftWidget
      hasNoUserTokens={!userTokens.length}
      isLoading={isLoading}
      className={className}
    />
  );
};

export default ListNftWidget;
