import { useEffect, useState } from 'react';

import { chainNames } from '@airswap/utils';

import { getRandomUuid } from '../helpers/crypto';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addToast, hideToast } from '../redux/stores/toasts/toastsActions';
import { setLastToastActionButtonIdClicked } from '../redux/stores/toasts/toastsSlice';
import { ToastType } from '../types/ToastType';
import { switchNetwork } from '../web3-connectors/helpers';

const useSwitchChain = (): void => {
  const dispatch = useAppDispatch();
  const { config } = useAppSelector((state) => state);
  const { isActive, chainId, connectionType } = useAppSelector((state) => state.web3);
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
      const toastId = getRandomUuid();

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
    if (!isActive && lastToastId) {
      dispatch(hideToast(lastToastId));

      setLastToastId(undefined);
    }
  }, [isActive]);

  useEffect(() => {
    if (!connectionType) {
      return;
    }

    if (lastToastActionButtonIdClicked && lastToastActionButtonIdClicked === lastToastId) {
      switchNetwork(config.chainId, connectionType).then(() => {
        dispatch(setLastToastActionButtonIdClicked(undefined));
      });
    }
  }, [lastToastActionButtonIdClicked]);
};

export default useSwitchChain;
