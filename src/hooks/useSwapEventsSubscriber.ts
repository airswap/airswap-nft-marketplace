import { useEffect, useState } from 'react';

import { Swap } from '@airswap/libraries/build/src/Contracts';
import { BigNumber } from 'bignumber.js';
import { noop } from 'react-use/lib/misc/util';

import { subtractTokenBalance } from '../entities/TokenIdsWithBalance/TokenIdsWithBalanceHelpers';
import { isEqualAddress } from '../helpers/string';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  fetchCurrencyTokenAllowance,
  fetchCurrencyTokenBalance,
  fetchUserTokens,
} from '../redux/stores/balances/balancesApi';
import { setTokens } from '../redux/stores/balances/balancesSlice';
import { setOrders } from '../redux/stores/collection/collectionSlice';
import { selectConfigFailed } from '../redux/stores/config/configSlice';
import { setOrders as setProfileOrders } from '../redux/stores/profileOrders/profileOrdersSlice';
import { addNftSoldToast } from '../redux/stores/toasts/toastsActions';
import useWeb3ReactLibrary from './useWeb3ReactLibrary';

interface LastSoldOrder {
  nonce: string;
  tokenId: string;
}

const useSwapEventsSubscriber = () => {
  const isFailed = useAppSelector(selectConfigFailed);
  const { account } = useAppSelector(state => state.web3);
  const { chainId, collectionToken, currencyToken } = useAppSelector(state => state.config);
  const { tokenIdsWithBalance } = useAppSelector(state => state.balances);
  const { orders } = useAppSelector(state => state.collection);
  const { orders: profileOrders } = useAppSelector(state => state.profileOrders);

  const dispatch = useAppDispatch();
  const { library } = useWeb3ReactLibrary();

  const [lastSoldOrder, setLastSoldOrder] = useState<LastSoldOrder>();

  useEffect(() => {
    if (
      !lastSoldOrder
        || !tokenIdsWithBalance[lastSoldOrder.tokenId]
        || !library
        || !account
    ) {
      return;
    }

    const newOrders = orders.filter(order => order.nonce !== lastSoldOrder.nonce);
    const newProfileOrders = profileOrders.filter(order => order.nonce !== lastSoldOrder.nonce);
    const newUserTokens = subtractTokenBalance(tokenIdsWithBalance, lastSoldOrder.tokenId);

    setLastSoldOrder(undefined);

    dispatch(addNftSoldToast(lastSoldOrder.tokenId));
    dispatch(setProfileOrders(newProfileOrders));
    dispatch(setTokens(newUserTokens));
    dispatch(setOrders(newOrders));

    dispatch(fetchCurrencyTokenBalance({
      chainId,
      provider: library,
      collectionTokenAddress: collectionToken,
      walletAddress: account,
    }));

    dispatch(fetchCurrencyTokenAllowance({
      chainId,
      provider: library,
      collectionTokenAddress: collectionToken,
      walletAddress: account,
    }));

    dispatch(fetchUserTokens({
      provider: library,
      walletAddress: account,
      collectionToken,
    }));
  }, [
    lastSoldOrder,
    tokenIdsWithBalance,
    library,
    account,
  ]);

  const onSwap = async (
    nonce: BigNumber,
    signerWallet: string,
    signerAmount: BigNumber,
    signerTokenId: BigNumber,
    signerToken: string,
    senderWallet: string,
    senderAmount: BigNumber,
    senderTokenId: BigNumber,
    senderToken: string,
  ) => {
    const tokenId = signerTokenId.toString();
    const orderNonce = nonce.toString();

    if (!account || !collectionToken || !currencyToken) {
      return;
    }

    if (
      isEqualAddress(signerWallet, account)
        && isEqualAddress(signerToken, collectionToken)
        && isEqualAddress(senderToken, currencyToken)
    ) {
      setLastSoldOrder({ tokenId, nonce: orderNonce });
    }
  };

  useEffect(() => {
    if (!library || !account || isFailed) {
      return noop;
    }

    const swapContract = Swap.getContract(library, chainId);

    swapContract.on('Swap', onSwap);

    return () => {
      swapContract.off('Swap', onSwap);
    };
  }, [library?.connection.url, account]);
};

export default useSwapEventsSubscriber;
