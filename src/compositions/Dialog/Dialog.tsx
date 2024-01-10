import {
  DialogHTMLAttributes,
  forwardRef,
  ForwardRefExoticComponent,
  ReactElement,
  Ref,
  RefAttributes, useEffect, useRef,
} from 'react';

import { generateEventPath } from '../../helpers/browser';
import IconButton from '../IconButton/IconButton';

import './Dialog.scss';

interface DialogProps extends DialogHTMLAttributes<HTMLDialogElement>, RefAttributes<HTMLDialogElement> {
  onClose: () => void;
  className?: string;
}

const Dialog: ForwardRefExoticComponent<DialogProps> = forwardRef(({
  onClose,
  className = '',
  children,
  ...dialogProps
}, ref: Ref<HTMLDialogElement>): ReactElement => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.onclick = (event: MouseEvent): void => {
      const eventPath = generateEventPath(event.target);

      if (contentRef.current && !eventPath.includes(contentRef.current)) {
        onClose();
      }
    };
  }, []);

  return (
    <dialog
      {...dialogProps}
      ref={ref}
      onClose={onClose}
      className={`dialog ${className}`}
    >
      <div className="dialog__content" ref={contentRef}>
        <IconButton
          hideLabel
          icon="close"
          text="close"
          onClick={onClose}
          className="dialog__close-button"
        />

        {children}
      </div>
    </dialog>
  );
});

export default Dialog;
