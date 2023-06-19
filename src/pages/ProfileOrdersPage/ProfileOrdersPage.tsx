import React, { FC } from 'react';

import Page from '../../compositions/Page/Page';
import ProfileOrdersWidget from '../../widgets/ProfileOrdersWidget/ProfileOrdersWidget';

import './ProfileOrdersPage.scss';

const ProfileOrdersPage: FC = () => (
  <Page
    className="profile-page"
    contentClassName="profile-page__content"
  >
    <ProfileOrdersWidget />
  </Page>
);

export default ProfileOrdersPage;
