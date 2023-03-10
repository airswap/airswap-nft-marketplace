import React, { FC } from 'react';

import Page from '../../compositions/Page/Page';
import ProfileWidget from '../../widgets/ProfileWidget/ProfileWidget';

import './ProfilePage.scss';

const ProfilePage: FC = () => (
  <Page
    className="profile-page"
    contentClassName="profile-page__content"
  >
    <ProfileWidget />
  </Page>
);

export default ProfilePage;
