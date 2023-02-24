import React, {
  FC, useEffect, useRef, useState,
} from 'react';

import { useEventListener } from 'usehooks-ts';

import Icon from '../Icon/Icon';

import './Accordion.scss';

interface AccordionProps {
  isDefaultOpen?: boolean;
  isHeadingDisabled?: boolean;
  isHeadingVisible?: boolean;
  hasBorder?: boolean;
  content: string | JSX.Element;
  label: string;
  className?: string;
}

const Accordion: FC<AccordionProps> = ({
  isDefaultOpen = false,
  isHeadingDisabled = false,
  isHeadingVisible = true,
  hasBorder = false,
  content,
  label,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [contentHeight, setContentHeight] = useState<number>();
  const headerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialise accordion
  useEffect(() => {
    if (contentRef.current) {
      const { height } = contentRef.current.getBoundingClientRect();
      if (!contentHeight) {
        setContentHeight(height);
        setIsOpen(isDefaultOpen);
        contentRef.current.style.height = isOpen ? `${height}px` : '0px';
        // Set transition duration based on height to maintain constant speed
        contentRef.current.style.transitionDuration = `${height / 300}s`;
      }
    }
  }, [contentRef.current]);

  useEffect(() => {
    if (contentRef.current) {
      if (contentHeight) {
        contentRef.current.style.height = isOpen ? `${contentHeight}px` : '0px';
      }
    }
  }, [isOpen]);

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  useEventListener('click', onClick, headerRef);
  return (
    <div className={`accordion ${className}`}>
      <button
        className={`accordion__header focus:outline-none ${isHeadingVisible ? '' : 'accordion__header--is-not-visible'} ${isOpen ? 'accordion__header--is-open' : ''}`}
        ref={headerRef}
        type="button"
        disabled={isHeadingDisabled}
      >
        <p className="accordion__label">{label}</p>
        <span className="accordion__state-indicator" style={{ transform: `rotate(${isOpen ? 0 : 180}deg)` }}><Icon className="accordion__state-indicator" name="chevron-down" /></span>
      </button>
      <div className={`accordion__content ${hasBorder ? 'accordion__content--has-border' : ''}`} ref={contentRef}>
        {typeof content === 'string' ? <p>{content}</p> : content}
      </div>
    </div>
  );
};

export default Accordion;
