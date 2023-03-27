import { useEffect } from 'react';

import { Wrapper } from '@airswap/libraries';
/* eslint-disable import/no-extraneous-dependencies */
import * as SwapContract from '@airswap/swap-erc20/build/contracts/SwapERC20.sol/SwapERC20.json';
// @ts-ignore
import * as swapDeploys from '@airswap/swap-erc20/deploys';
import * as WrapperContract from '@airswap/wrapper/build/contracts/Wrapper.sol/Wrapper.json';
import { Contract } from '@ethersproject/contracts';
/* eslint-enable import/no-extraneous-dependencies */
import { useAsync } from '@react-hookz/web/esm';
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';

const useSwapLogs = () => {
  const [state, actions] = useAsync(
    async (
      swapContract: Contract,
      wrapperContract: Contract,
      account: string,
    ) => {
      const signerSwapFilter = swapContract.filters.SwapERC20(
        null, // nonce
        account, // signerWallet
        null, // signerToken
        null, // signerAmount,
        null, // protocol fee
        null, // senderWallet
        null, // senderToken
        null, // senderAmount
      );

      const senderSwapFilter = swapContract.filters.SwapERC20(
        null, // nonce
        null, // signerWallet
        null, // signerToken
        null, // signerAmount,cd
        null, // protocol fee
        account, // senderWallet
        null, // senderToken
        null, // senderAmount
      );

      const wrapperSwapFilter = wrapperContract.filters.WrappedSwapFor(
        account, // senderWallet
      );

      const [lastLookSwapLogs, rfqSwapLogs, wrappedSwapLogs] = await Promise.all([
        swapContract.queryFilter(signerSwapFilter),
        swapContract.queryFilter(senderSwapFilter),
        wrapperContract.queryFilter(wrapperSwapFilter),
      ]);

      return {
        lastLookSwapLogs,
        rfqSwapLogs,
        wrappedSwapLogs,
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        chainId,
        account,
      };
    },
    null,
  );

  const {
    chainId,
    account,
    library: provider,
  } = useWeb3React<providers.Provider>();

  useEffect(() => {
    if (!chainId || !account || !provider) return;

    const swapContract = new Contract(
      swapDeploys[chainId],
      SwapContract.abi,
      provider,
    );

    const wrapperContract = new Contract(
      Wrapper.getAddress(chainId),
      WrapperContract.abi,
      provider,
    );
    actions.execute(swapContract, wrapperContract, account);
  }, [chainId, account, provider, actions]);

  return state;
};

export default useSwapLogs;
