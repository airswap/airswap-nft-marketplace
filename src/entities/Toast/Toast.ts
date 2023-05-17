import { ToastType } from '../../types/ToastType';

export interface Toast {
  isHidden?: boolean;
  hideCloseButton?: boolean;
  willAutomaticallyHide?: boolean;
  actionButtonText?: string;
  text?: string;
  title: string;
  id: string;
  type: ToastType;
}
