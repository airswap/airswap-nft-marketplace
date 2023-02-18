import React, { FC } from 'react';

import Page from '../../compositions/Page/Page';
import ProfileWidget from '../../widgets/ProfileWidget/ProfileWidget';

const ProfilePage: FC = () => (
  <Page>
    <ProfileWidget />
  </Page>
);

export default ProfilePage;
