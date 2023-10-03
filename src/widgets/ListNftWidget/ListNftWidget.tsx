import React, { FC } from 'react';

import { useWeb3React } from '@web3-react/core';
import { useLocation, useSearchParams } from 'react-router-dom';

import { useAppSelector } from '../../redux/hooks';
import ConnectedListNftWidget from './subcomponents/ConnectedListNftWidget/ConnectedListNftWidget';
import DisconnectedListNftWidget from './subcomponents/DisconnectedListNftWidget/DisconnectedListNftWidget';

interface ListNftWidgetProps {
  className?: string;
}

const ListNftWidget: FC<ListNftWidgetProps> = ({ className = '' }) => {
  const { account, provider: library, chainId } = useWeb3React();
  const [searchParams] = useSearchParams();
  const { key } = useLocation();

  const { config } = useAppSelector(state => state);
  const { tokens: userTokens } = useAppSelector(state => state.balances);
  const { isLoading: isMetadataLoading, currencyTokenInfo } = useAppSelector(state => state.metadata);
  const { isInitialized: isBalancesInitialized } = useAppSelector(state => state.balances);

  const tokenId = searchParams.get('tokenId');
  const isLoading = !isBalancesInitialized || isMetadataLoading;
  const chainIdIsCorrect = !!chainId && chainId === config.chainId;

  if (
    !isLoading
    && account
    && currencyTokenInfo
    && library
    && userTokens.length
    && chainIdIsCorrect
  ) {
    return (
      <ConnectedListNftWidget
        key={key}
        account={account}
        chainId={chainId}
        currencyTokenInfo={currencyTokenInfo}
        library={library}
        defaultSelectedTokenId={tokenId || undefined}
        userTokens={userTokens}
        className={className}
      />
    );
  }

  return (
    <DisconnectedListNftWidget
      hasNoUserTokens={!userTokens.length}
      isLoading={isLoading || !chainIdIsCorrect}
      className={className}
    />
  );
};

export default ListNftWidget;
