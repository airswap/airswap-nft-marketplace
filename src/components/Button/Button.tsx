import {
  forwardRef,
  ForwardRefExoticComponent,
  ReactElement,
  Ref,
  RefAttributes,
} from 'react';

import './Button.scss';

type HTMLButtonProps = JSX.IntrinsicElements['button'];

export interface ButtonProps extends HTMLButtonProps {
  text?: string;
}

export type ButtonWithRefProps = ButtonProps & RefAttributes<HTMLButtonElement>;

const Button: ForwardRefExoticComponent<ButtonWithRefProps> = forwardRef(({
  type = 'button',
  text,
  className = '',
  children,
  ...buttonProps
}, ref: Ref<HTMLButtonElement>): ReactElement => (
  <button
    {...buttonProps}
    ref={ref}
    type={type} // eslint-disable-line react/button-has-type
    className={`button ${className}`}
  >
    {children || text}
  </button>
));

export default Button;
