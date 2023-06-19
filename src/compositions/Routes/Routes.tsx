import React, { FC } from 'react';

import { createHashRouter, RouterProvider } from 'react-router-dom';

import {
  BuyNftPage,
  CollectionPage,
  ListNftPage,
  NftDetailPage,
  ProfileOrdersPage,
  ProfilePage,
  SwapPage,
} from '../../pages';
import { AppRoutes, ProfileRoutes } from '../../routes';

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
      path: `/${AppRoutes.nftDetail}/:id`,
      element: <NftDetailPage />,
    },
    {
      path: `/${AppRoutes.nftDetail}/:id/buy`,
      element: <BuyNftPage />,
    },
    {
      path: `/${AppRoutes.profile}`,
      children: [
        {
          path: ':account',
          element: <ProfilePage />,
        },
        {
          path: `:account/${ProfileRoutes.orders}`,
          element: <ProfileOrdersPage />,
        },
      ],
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
