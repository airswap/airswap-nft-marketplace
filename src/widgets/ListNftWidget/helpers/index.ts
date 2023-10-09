import { ListNftState } from '../subcomponents/ConnectedListNftWidget/ConnectedListNftWidget';

export const getTitle = (state: ListNftState): string => {
  if (state === ListNftState.review) {
    return 'Review Listing';
  }

  if (state === ListNftState.tokenAlreadyListedWarning) {
    return 'Warning';
  }

  if (state === ListNftState.approve) {
    return 'Approve in Wallet';
  }

  if (state === ListNftState.approving) {
    return 'Transaction in Progress';
  }

  if (state === ListNftState.sign) {
    return 'Sign in Wallet';
  }

  if (state === ListNftState.indexing) {
    return 'Listing in Progress';
  }

  if (state === ListNftState.success) {
    return 'Successfully listed';
  }

  if (state === ListNftState.failed) {
    return 'Listing failed';
  }

  return 'List a token';
};
