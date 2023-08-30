import React, { FC } from 'react';

import Helmet from '../../compositions/Helmet/Helmet';
import DebugWidget from '../../widgets/DebugWidget/DebugWidget';

const DebugPage: FC = () => (
  <div className="debug-page">
    <Helmet title="Debugger" />
    <DebugWidget />
  </div>
);

export default DebugPage;
