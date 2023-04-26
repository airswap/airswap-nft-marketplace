import { useEffect } from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import * as SwapContract from '@airswap/swap/build/contracts/Swap.sol/Swap.json';
import * as swapDeploys from '@airswap/swap/deploys';
import { Contract } from '@ethersproject/contracts';
/* eslint-enable import/no-extraneous-dependencies */
import { useAsync } from '@react-hookz/web/esm';
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';

const useSwapLogs = () => {
  const [state, actions] = useAsync(
    async (
      swapContract: Contract,
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

      const [lastLookSwapLogs, rfqSwapLogs] = await Promise.all([
        swapContract.queryFilter(signerSwapFilter),
        swapContract.queryFilter(senderSwapFilter),
      ]);

      return {
        lastLookSwapLogs,
        rfqSwapLogs,
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
    actions.execute(swapContract, account);
  }, [chainId, account, provider, actions]);

  return state;
};

export default useSwapLogs;
