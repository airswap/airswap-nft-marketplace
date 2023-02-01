import React, { FC, useRef, useState } from 'react';

import { useEventListener } from 'usehooks-ts';

import './NftDetailAccordian.scss';

interface NftDetailAccordianProps {
  label: string;
  content: string | JSX.Element;
  defaultOpen?: boolean;
  className?: string;
}

const NftDetailAccordian: FC<NftDetailAccordianProps> = ({
  label, content, defaultOpen = false, className = '',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [stateIndicator, setStateIndicator] = useState<number>(defaultOpen ? 180 : 0);
  const headerRef = useRef(null);
  const onClick = () => {
    if (isOpen) {
      setStateIndicator(0);
    } else {
      setStateIndicator(180);
    }
    setIsOpen(!isOpen);
  };

  useEventListener('click', onClick, headerRef);
  return (
    <div className={`nft-detail-accordian ${className}`}>
      <div className="nft-detail-accordian__header" ref={headerRef}>
        <p className="nft-detail-accordian__label">{label}</p>
        <p className="nft-detail-accordian__state-indicator" style={{ transform: `rotate(${stateIndicator}deg)` }}>V</p>
      </div>
      <div className={`nft-detail-accordian__content ${isOpen ? 'nft-detail-accordian__content--is-open' : ''}`}>
        {typeof content === 'string' ? <p>{content}</p> : content}
      </div>
    </div>
  );
};

export default NftDetailAccordian;
