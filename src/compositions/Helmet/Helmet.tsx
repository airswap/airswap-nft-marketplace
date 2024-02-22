import { FC, ReactElement } from 'react';

import { Helmet as ReactHelmet } from 'react-helmet';

import useCollectionName from '../../hooks/useCollectionName';

interface HelmetProps {
  title?: string;
}

const Helmet: FC<HelmetProps> = ({ title }): ReactElement => {
  const collectionName = useCollectionName();

  return (
    <ReactHelmet>
      <title>{`${collectionName} ${title ? `- ${title}` : ''}`}</title>
    </ReactHelmet>
  );
};

export default Helmet;
