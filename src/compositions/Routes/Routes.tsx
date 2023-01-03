import React, { FC } from 'react';

import { createHashRouter, RouterProvider } from 'react-router-dom';

import {
  CollectionPage,
  ListNftPage,
  NftDetailPage,
  ProfilePage,
  SwapPage,
} from '../../pages';
import { AppRoutes } from '../../routes';

const Routes: FC = () => {
  const router = createHashRouter([
    {
      path: '/',
      element: <CollectionPage />,
    },
    {
      path: `/${AppRoutes.listNft}`,
      element: <ListNftPage />,
    },
    {
      path: `/${AppRoutes.nftDetail}`,
      element: <NftDetailPage />,
    },
    {
      path: `/${AppRoutes.profile}`,
      element: <ProfilePage />,
    },
    {
      path: `/${AppRoutes.swap}`,
      element: <SwapPage />,
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
};

export default Routes;
