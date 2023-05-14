import React, { FC } from 'react';

interface NftNotFoundProps {
  id: number;
  className?: string;
}

const NftNotFound: FC<NftNotFoundProps> = ({ id, className = '' }) => (
  <div className={`ntf-not-found ${className}`}>
    {`NFT with id ${id} not found`}
  </div>
);

export default NftNotFound;
