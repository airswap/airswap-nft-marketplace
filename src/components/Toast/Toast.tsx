import React, {
  FC,
  ReactElement,
  useEffect, useRef,
  useState,
} from 'react';

import classnames from 'classnames';

import IconButton from '../../compositions/IconButton/IconButton';
import { Toast as ToastInterface } from '../../entities/Toast/Toast';
import Icon from '../Icon/Icon';
import { getToastIcon } from './helpers/getToastIcon';

import './Toast.scss';

interface ToastProps {
  toast: ToastInterface;
  onHide: (id: string) => void;
  className?: string;
}

const Toast: FC<ToastProps> = ({ toast, onHide, className = '' }): ReactElement => {
  const [height, setHeight] = useState(0);

  const elementRef = useRef<HTMLDivElement>(null);

  const toastClassName = classnames('toast', {
    [`toast--is-${toast.type}`]: toast.type,
    'toast--is-hidden': toast.isHidden,
  }, className);

  const iconName = getToastIcon(toast.type);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    if (toast.willAutomaticallyHide) {
      timeoutId = setTimeout(() => onHide(toast.id), 3000);
    }

    return () => clearInterval(timeoutId);
  }, [toast.willAutomaticallyHide]);

  useEffect(() => {
    if (elementRef.current && !height) {
      setHeight(elementRef.current.clientHeight);
    }
  }, [elementRef.current]);

  return (
    <div
      style={{ height: height || 'auto' }}
      className={toastClassName}
    >
      <div ref={elementRef} className="toast__inner">
        <div className="toast__icon-wrapper">
          <div className="toast__icon-wrapper-background" />
          <Icon className="toast__icon" name={iconName} />
        </div>
        <div className="toast__title-text-wrapper">
          <h1 className="toast__title">{toast.title}</h1>
          {toast.text && (
            <p className="toast__text">
              {toast.text}
            </p>
          )}
        </div>
        <IconButton
          hideLabel
          icon="button-x"
          text="close"
          className="toast__close-button"
          onClick={() => onHide(toast.id)}
        />
      </div>
    </div>
  );
};

export default Toast;
