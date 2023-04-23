import React, { FC, ReactElement } from 'react';

import Toast from '../../components/Toast/Toast';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { hideToast } from '../../redux/stores/toasts/toastsActions';

import './ToastsWidget.scss';

const ToastsWidget: FC = (): ReactElement => {
  const dispatch = useAppDispatch();
  const { toasts } = useAppSelector((state) => state.toasts);

  const handleToastHide = (toastId: string) => {
    dispatch(hideToast(toastId));
  };

  return (
    <div className="toasts-widget">
      {
        [...toasts]
          .reverse()
          .map(toast => (
            <Toast
              key={toast.id}
              toast={toast}
              onHide={handleToastHide}
              className="toasts-widget__toast"
            />
          ))
      }
    </div>
  );
};

export default ToastsWidget;
