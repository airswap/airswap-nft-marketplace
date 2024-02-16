import {
  AnimationEvent,
  DialogHTMLAttributes,
  forwardRef,
  ForwardRefExoticComponent,
  ReactElement,
  Ref,
  RefAttributes,
  useEffect,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';

import { generateEventPath } from '../../helpers/browser';
import IconButton from '../IconButton/IconButton';

import './Dialog.scss';

interface DialogProps extends DialogHTMLAttributes<HTMLDialogElement>, RefAttributes<HTMLDialogElement> {
  // Use isClosing for when you want to close the dialog from the parent component
  isClosing?: boolean;
  label?: string;
  onClose: () => void;
  className?: string;
}

const Dialog: ForwardRefExoticComponent<DialogProps> = forwardRef(({
  label,
  onClose,
  className = '',
  children,
  isClosing: isClosingProp,
  ...dialogProps
}, ref: Ref<HTMLDialogElement>): ReactElement => {
  const [isClosing, setIsClosing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleAnimationEnd = (event: AnimationEvent<HTMLDialogElement>) => {
    if (event.animationName === 'fadeOut' || event.animationName === 'slideOut') {
      onClose();
    }
  };

  const handleClose = () => {
    setIsClosing(true);
  };

  useEffect(() => {
    const handleWindowClick = (event: MouseEvent): void => {
      const eventPath = generateEventPath(event.target);

      if (contentRef.current && !eventPath.includes(contentRef.current)) {
        onClose();
      }
    };

    window.addEventListener('click', handleWindowClick);

    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  useEffect(() => {
    if (isClosingProp) {
      setIsClosing(true);
    }
  }, [isClosingProp]);

  const dialogClassName = classNames('dialog', {
    'dialog--is-closing': isClosing,
  }, className);

  return (
    <dialog
      {...dialogProps}
      ref={ref}
      onClose={onClose}
      onAnimationEndCapture={handleAnimationEnd}
      className={dialogClassName}
    >
      <div className="dialog__content" ref={contentRef}>
        <div className="dialog__header">
          <h3 className="dialog__label">{label}</h3>

          <IconButton
            hideLabel
            icon="close"
            text="close"
            onClick={handleClose}
            className="dialog__close-button"
          />
        </div>

        <div className="dialog__children-wrapper">
          {children}
        </div>
      </div>
    </dialog>
  );
});

export default Dialog;
