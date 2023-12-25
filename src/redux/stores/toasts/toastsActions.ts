import { Toast } from '../../../entities/Toast/Toast';
import { getRandomUuid } from '../../../helpers/crypto';
import { ToastType } from '../../../types/ToastType';
import { AppDispatch, RootState } from '../../store';
import { setToasts } from './toastsSlice';

export const addToast = (newToast: Toast) => async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
  const { toasts } = getState().toasts;

  const newToasts = [newToast, ...toasts].reduce((total, toast, index) => {
    const amountOfNonWillAutomaticallyHide = total.filter(t => !t.willAutomaticallyHide).length;

    const updatedToast = {
      ...toast,
      ...(index > 2 && toast.willAutomaticallyHide && { isHidden: true }),
      ...(amountOfNonWillAutomaticallyHide > 2 && { isHidden: true }),
    };

    return [
      ...total,
      updatedToast,
    ];
  }, [] as Toast[]);

  dispatch(setToasts(newToasts));
};

export const hideToast = (toastId: string) => async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
  const { toasts } = getState().toasts;

  const newToast = toasts.find(toast => toast.id === toastId);

  if (!newToast || newToast.isHidden) {
    return;
  }

  const index = toasts.findIndex(toast => toast.id === toastId);
  const updatedToast = { ...newToast, isHidden: true };
  const updatedToasts = [...toasts];
  updatedToasts.splice(index, 1, updatedToast);

  dispatch(setToasts(updatedToasts));
};

export const removeHiddenToasts = () => async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
  const { toasts } = getState().toasts;

  if (!toasts.some(toast => toast.isHidden)) {
    return;
  }

  dispatch(setToasts([...toasts].filter(toast => !toast.isHidden)));
};

export const addUserRejectedToast = () => async (dispatch: AppDispatch): Promise<void> => {
  dispatch(addToast({
    type: ToastType.deny,
    id: getRandomUuid(),
    title: 'User rejected request',
    willAutomaticallyHide: true,
  }));
};

export const addGetOrderFailedToast = () => async (dispatch: AppDispatch): Promise<void> => {
  dispatch(addToast({
    type: ToastType.fail,
    id: getRandomUuid(),
    title: 'Server error',
    text: 'Failed to get orders from indexers',
    willAutomaticallyHide: true,
  }));
};

export const addGetNftMetadataFailedToast = (error?: string) => async (dispatch: AppDispatch): Promise<void> => {
  dispatch(addToast({
    type: ToastType.fail,
    id: getRandomUuid(),
    title: 'Get NFT metadata failed',
    text: error,
    willAutomaticallyHide: true,
  }));
};

export const addInfoToast = (title: string, text: string) => async (dispatch: AppDispatch): Promise<void> => {
  dispatch(addToast({
    type: ToastType.info,
    id: getRandomUuid(),
    title,
    text,
    willAutomaticallyHide: true,
  }));
};

export const addNftSoldToast = (tokenId: string) => async (dispatch: AppDispatch): Promise<void> => {
  dispatch(addToast({
    type: ToastType.success,
    id: getRandomUuid(),
    title: 'Nft Sold',
    text: `Your nft with id #${tokenId} has been sold.`,
  }));
};
