import React, { FC } from 'react';

import IconButton from '../IconButton/IconButton';

import './CopyLinkButton.scss';

interface CopyLinkButtonProps {
  className?: string;
}

const CopyLinkButton: FC<CopyLinkButtonProps> = ({ className = '' }) => (
  <IconButton
    icon="copy2"
    text="Copy link"
    iconAlign="right"
    className={`copy-link-button ${className}`}
  />
);

export default CopyLinkButton;
