import React, { FC } from 'react';

import './Input.scss';

type HTMLInputProps = JSX.IntrinsicElements['input'];

interface InputProps extends HTMLInputProps {
  className?: string;
}

const Input: FC<InputProps> = ({ type, className = '', ...props }) => (
  <input
    {...props}
    type={type}
    className={`input ${className}`}
  />
);

export default Input;
