import { ToastType } from '../../types/ToastType';

export interface Toast {
  isHidden?: boolean;
  id: string;
  willAutomaticallyHide?: boolean;
  text?: string;
  title: string;
  type: ToastType;
}
