import { CancelOrderState } from '../subcomponents/ConnectedCancelOrderWidget/ConnectedCancelOrderWidget';

export const getTitle = (state: CancelOrderState): string => {
  if (state === CancelOrderState.sign) {
    return 'Sign in Wallet';
  }

  if (state === CancelOrderState.canceling) {
    return 'Canceling in progress';
  }

  if (state === CancelOrderState.success) {
    return 'Successfully canceled';
  }

  if (state === CancelOrderState.failed) {
    return 'Failed';
  }

  return 'Are you sure you want to cancel?';
};
