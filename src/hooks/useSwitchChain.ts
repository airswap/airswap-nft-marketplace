import { useEffect, useState } from 'react';

import { chainNames } from '@airswap/constants';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addToast, hideToast } from '../redux/stores/toasts/toastsActions';
import { setLastToastActionButtonIdClicked } from '../redux/stores/toasts/toastsSlice';
import { ToastType } from '../types/ToastType';

const useSwitchChain = (): void => {
  const dispatch = useAppDispatch();
  const { active, chainId } = useWeb3React<Web3Provider>();
  const { config } = useAppSelector((state) => state);
  const { lastToastActionButtonIdClicked } = useAppSelector((state) => state.toasts);

  const [lastToastId, setLastToastId] = useState<string>();

  useEffect(() => {
    if (!chainId) {
      return;
    }

    if (lastToastId) {
      dispatch(hideToast(lastToastId));

      setLastToastId(undefined);
    }

    if (chainId !== config.chainId) {
      const toastId = crypto.randomUUID();

      setLastToastId(toastId);

      dispatch(addToast({
        type: ToastType.warning,
        hideCloseButton: true,
        willAutomaticallyHide: false,
        actionButtonText: `Switch to ${chainNames[config.chainId]}`,
        id: toastId,
        title: 'Wrong network',
        text: `Your wallet must be connected to ${chainNames[config.chainId]}.`,
      }));
    }
  }, [chainId, config.chainId]);

  useEffect(() => {
    if (!active && lastToastId) {
      dispatch(hideToast(lastToastId));

      setLastToastId(undefined);
    }
  }, [active]);

  useEffect(() => {
    if (lastToastActionButtonIdClicked && lastToastActionButtonIdClicked === lastToastId) {
      window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${config.chainId}` }],
      });

      dispatch(setLastToastActionButtonIdClicked(undefined));
    }
  }, [lastToastActionButtonIdClicked]);
};

export default useSwitchChain;
