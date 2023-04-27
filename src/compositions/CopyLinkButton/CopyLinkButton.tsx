import React, { FC } from 'react';

import IconButton from '../IconButton/IconButton';

import './CopyLinkButton.scss';

interface CopyLinkButtonProps {
  onClick: () => void;
  className?: string;
}

const CopyLinkButton: FC<CopyLinkButtonProps> = ({ onClick, className = '' }) => (
  <IconButton
    icon="copy2"
    text="Copy link"
    iconAlign="right"
    onClick={onClick}
    className={`copy-link-button ${className}`}
  />
);

export default CopyLinkButton;
