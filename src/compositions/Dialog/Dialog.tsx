import {
  DialogHTMLAttributes,
  forwardRef,
  ForwardRefExoticComponent,
  ReactElement,
  Ref,
  RefAttributes,
  useEffect,
  useRef,
} from 'react';

import { generateEventPath } from '../../helpers/browser';
import IconButton from '../IconButton/IconButton';

import './Dialog.scss';

interface DialogProps extends DialogHTMLAttributes<HTMLDialogElement>, RefAttributes<HTMLDialogElement> {
  label?: string;
  onClose: () => void;
  className?: string;
}

const Dialog: ForwardRefExoticComponent<DialogProps> = forwardRef(({
  label,
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
        <div className="dialog__header">
          <h3 className="dialog__label">{label}</h3>

          <IconButton
            hideLabel
            icon="close"
            text="close"
            onClick={onClose}
            className="dialog__close-button"
          />
        </div>

        {children}
      </div>
    </dialog>
  );
});

export default Dialog;
