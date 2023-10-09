import React, { FC, useEffect } from 'react';

import { useWeb3React } from '@web3-react/core';
import { useLocation, useSearchParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserOrders } from '../../redux/stores/listNft/listNftApi';
import { selectCancelOrderTransactions } from '../../redux/stores/transactions/transactionsSlice';
import ConnectedListNftWidget from './subcomponents/ConnectedListNftWidget/ConnectedListNftWidget';
import DisconnectedListNftWidget from './subcomponents/DisconnectedListNftWidget/DisconnectedListNftWidget';

interface ListNftWidgetProps {
  className?: string;
}

const ListNftWidget: FC<ListNftWidgetProps> = ({ className = '' }) => {
  const { account, provider: library, chainId } = useWeb3React();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { key } = useLocation();

  const { config } = useAppSelector(state => state);
  const { isLoadingUserOrders, userOrders } = useAppSelector(state => state.listNft);
  const { isInitialized: isBalancesInitialized, tokens: userTokens } = useAppSelector(state => state.balances);
  const { isLoading: isMetadataLoading, currencyTokenInfo } = useAppSelector(state => state.metadata);
  const { isInitialized: isIndexerInitialized } = useAppSelector(state => state.indexer);
  const transactions = useAppSelector(selectCancelOrderTransactions);

  const tokenId = searchParams.get('tokenId');
  const isLoading = !isBalancesInitialized || isMetadataLoading || !isIndexerInitialized || isLoadingUserOrders;
  const chainIdIsCorrect = !!chainId && chainId === config.chainId;

  useEffect(() => {
    if (isIndexerInitialized && !isLoadingUserOrders && account) {
      dispatch(getUserOrders({
        excludeNonces: transactions.map(transaction => transaction.order.nonce),
        signerTokens: [config.collectionToken],
        signerWallet: account,
        limit: 9999,
        offset: 0,
      }));
    }
  }, [account, isIndexerInitialized]);

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
        userOrders={userOrders}
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
