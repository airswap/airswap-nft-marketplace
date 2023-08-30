import { FC, ReactElement } from 'react';

import { Helmet as ReactHelmet } from 'react-helmet';

import { useAppSelector } from '../../redux/hooks';

interface HelmetProps {
  title?: string;
}

const Helmet: FC<HelmetProps> = ({ title }): ReactElement => {
  const { collectionName } = useAppSelector((state) => state.config);

  return (
    <ReactHelmet>
      <title>{`${collectionName} ${title ? `- ${title}` : ''}`}</title>
    </ReactHelmet>
  );
};

export default Helmet;
