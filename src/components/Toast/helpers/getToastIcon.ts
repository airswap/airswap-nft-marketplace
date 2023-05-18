import { ToastType } from '../../../types/ToastType';
import { icons } from '../../Icon/Icon';

export const getToastIcon = (toastType: ToastType): keyof typeof icons => {
  if (toastType === ToastType.success) {
    return 'marker-check';
  }

  if (toastType === ToastType.pending) {
    return 'transaction-pending';
  }

  if (toastType === ToastType.fail) {
    return 'button-x';
  }

  if (toastType === ToastType.deny) {
    return 'deny';
  }

  if (toastType === ToastType.warning) {
    return 'information-circle-outline';
  }

  return 'airswap';
};
