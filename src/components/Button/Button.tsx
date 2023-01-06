import { FC, ReactElement } from 'react';

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
}): ReactElement => (
  <button
    {...buttonProps}
    type={type} // eslint-disable-line react/button-has-type
    className={`button ${className}`}
  >
    {children || text}
  </button>
);

export default Button;
