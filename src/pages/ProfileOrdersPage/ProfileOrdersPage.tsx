import React, { FC } from 'react';

import ConnectedPage from '../../connectors/ConnectedPage/ConnectedPage';
import ProfileOrdersWidget from '../../widgets/ProfileOrdersWidget/ProfileOrdersWidget';

import './ProfileOrdersPage.scss';

const ProfileOrdersPage: FC = () => (
  <ConnectedPage
    className="profile-page"
    contentClassName="profile-page__content"
  >
    <ProfileOrdersWidget />
  </ConnectedPage>
);

export default ProfileOrdersPage;
