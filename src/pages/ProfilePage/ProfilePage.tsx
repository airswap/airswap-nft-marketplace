import React, { FC } from 'react';

import ConnectedPage from '../../connectors/ConnectedPage/ConnectedPage';
import ProfileWidget from '../../widgets/ProfileWidget/ProfileWidget';

import './ProfilePage.scss';

const ProfilePage: FC = () => (
  <ConnectedPage
    className="profile-page"
    contentClassName="profile-page__content"
  >
    <ProfileWidget />
  </ConnectedPage>
);

export default ProfilePage;
