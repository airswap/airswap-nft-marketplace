import { FC, ReactElement, Ref } from 'react';

import './Button.scss';

type HTMLButtonProps = JSX.IntrinsicElements['button'];

export interface ButtonProps extends HTMLButtonProps {
  text: string;
}

const Button: FC<ButtonProps> = ({
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
);

export default Button;
