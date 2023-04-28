import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
} from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from 'lodash.debounce';

import Toast from '../../components/Toast/Toast';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { hideToast, removeHiddenToasts } from '../../redux/stores/toasts/toastsActions';

import './ToastsWidget.scss';

const ToastsWidget: FC = (): ReactElement => {
  const dispatch = useAppDispatch();
  const { toasts } = useAppSelector((state) => state.toasts);

  const cleanupToasts = () => {
    dispatch(removeHiddenToasts());
  };

  const debouncedCleanupToasts = useCallback(
    debounce(cleanupToasts, 1000),
    [],
  );

  const handleToastHide = async (toastId: string) => {
    dispatch(hideToast(toastId));
    debouncedCleanupToasts();
  };

  useEffect(() => {
    debouncedCleanupToasts();
  }, [toasts]);

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
